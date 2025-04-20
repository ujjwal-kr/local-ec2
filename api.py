from flask import Flask, request, jsonify
import docker
from docker.types import Mount
from threading import Thread
from flask_cors import CORS

app = Flask(__name__)
client = docker.from_env()
CORS(app)

def create_ec2_instance(name, ssh_port, volumes=None, mem=1024, cpus=1):
    for instance in client.containers.list():
        if instance.name == name:
            return
    image, _ = client.images.build(path=".", dockerfile="Dockerfile", tag="ec2-sim")
    volume = client.volumes.create(f"{name}_data", driver="local")
    mounts = [Mount("/home/ubuntu", volume.name, type="volume")]
    if volumes is not None:
        for v in volumes:
            target = v.get("target")
            source = v.get("source")
            mounts.append(Mount(target=target, source=source, type="volume"))
    try:
        instance = client.containers.run(
            image.id,
            name=name,
            detach=True,
            ports={
                '22/tcp': ssh_port,
            },
            mounts=mounts,
            nano_cpus=int(cpus*1e9),
            mem_limit=int(mem * 1024 * 1024),
            mem_reservation= int(mem * 1024 * 1024 * 0.9),
            security_opt=["seccomp=unconfined"],
            privileged=True,
        )
        return instance
    except Exception as e:
        print(e)

@app.route('/run_instances', methods=['POST'])
def run_instances():
    data = request.json
    name = data.get('name', 'myec2')
    port = int(data.get('ssh_port', 22))
    mem = int(data.get('mem'))
    cpus = int(data.get('cpus'))
    t = Thread(target=create_ec2_instance, args=(name, port, None, mem, cpus))
    t.start()
    return jsonify({"message": "Instence is being created", "name": name, "ssh_port": port, "mem": mem, "cpus": cpus})

@app.route('/describe_instances', methods=['GET'])
def describe_instances():
    response = []
    instances = client.containers.list()
    for instance in instances:
        ports = instance.ports
        ip_addr = instance.attrs['NetworkSettings']['Networks']['bridge']['IPAddress']
        i = {
            "id": instance.short_id,
            "name": instance.name,
            "status": instance.status,
            "ports": ports,
            "ip_addr": ip_addr,
        }
        response.append(i)
    return jsonify(response)

@app.route('/forward_port', methods=['POST'])
def forward_port():
    data = request.json
    instance_name = data.get('instance_name')
    guest = data.get('guest')
    host = data.get('host')

    try:
        instance = client.containers.get(instance_name)
    except docker.errors.NotFound:
        return jsonify({"error": "Instance not found"}), 404

    current_ports = {}
    for guest_port, bindings in instance.ports.items():
        if bindings:
            current_ports[guest_port] = bindings[0]['HostPort']

    if '/' not in guest:
        guest += '/tcp'
    current_ports[guest] = host

    host_config = instance.attrs['HostConfig']
    cpus = host_config.get('NanoCpus', 1e9) / 1e9 
    mem = host_config.get('Memory', 1024 * 1024) // (1024 * 1024)

    volumes = []
    default_volume = f"{instance_name}_data"
    for mount in instance.attrs['Mounts']:
        if not (mount['Destination'] == '/home/ubuntu' and mount['Source'] == default_volume):
            volumes.append({
                "source": mount['Source'],
                "target": mount['Destination']
            })
    instance.kill()
    instance.remove()
    t = Thread(target=create_ec2_instance, args=(instance_name, current_ports, volumes, mem, cpus))
    t.start()

    return jsonify({
        "message": "Port forwarding added",
        "instance": instance_name,
        "ports": current_ports
    })

@app.route('/terminate_instances', methods=['POST'])
def terminate_instances():
    data = request.json
    instance_id = data['instance_id']
    instance = client.containers.get(instance_id)
    instance.kill()
    instance.remove()
    return jsonify({"status": "terminated"})

@app.route('/list_volumes', methods=["GET"])
def list_volumes():
    volumes = client.volumes.list()
    vols = []
    for v in volumes:
        vols.append(v.name)
    return jsonify(vols)

@app.route('/add_volume', methods=["POST"])
def add_volume():
    data = request.json
    name = data.get('name')
    volume = client.volumes.create(name, driver="local")
    return jsonify({"name": volume.name})

@app.route('/attatch_volume', methods=['POST'])
def attatch_volume():
    data = request.json
    instance_name = data.get('instance_name')
    source = data.get('source')
    target = data.get('target')
    instances = client.containers.list()
    for instance in instances:
        if instance.name == instance_name:
            c = client.containers.get(container_id=instance.id)
            c.kill()
            c.remove()
            break
    volumes = []
    volumes.append({"source": source, "target": target})
    create_ec2_instance(instance_name, 3022, volumes=volumes)
    return jsonify({"message": "Done"})

@app.route('/remove_volume', methods=["DELETE"])
def remove_volume():
    data = request.json
    name = data.get('name')
    volume = client.volumes.get(name)
    volume.remove(force=True)
    return jsonify({"message": "done"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969)