from flask import Flask, request, jsonify
import docker
from docker.types import Mount
from threading import Thread

app = Flask(__name__)
client = docker.from_env()

def create_ec2_container(name, ssh_port, volumes=None):
    image, _ = client.images.build(path="../", dockerfile="Dockerfile", tag="ec2-sim")
    volume = client.volumes.create(f"{name}_data", driver="local")
    mounts = [Mount("/home/ubuntu", volume.name, type="volume")]
    if volumes is not None:
        for v in volumes:
            target = v.get("target")
            source = v.get("source")
            mounts.append(Mount(target=target, source=source, type="volume"))

    container = client.containers.run(
        image.id,
        name=name,
        detach=True,
        ports={
            '22/tcp': ssh_port,
        },
        mounts=mounts,
        cpuset_cpus="0",
        cpu_period=100000,
        cpu_quota=100000,
        mem_limit=1024 * 1024 * 1024,  # 1G
        mem_reservation=512 * 1024 * 1024,  # 512M
        security_opt=["seccomp=unconfined"],
        privileged=True,
    )
    print(container.id)
    return container

@app.route('/run_instances', methods=['POST'])
def run_instances():
    data = request.json
    name = data.get('name', 'myec2')
    port = int(data.get('ssh_port', 22))
    thread = Thread(target=create_ec2_container, args=(name,port))
    thread.start()
    return jsonify({"message": "Done"})

@app.route('/describe_instances', methods=['GET'])
def describe_instances():
    response = []
    instances = client.containers.list()
    for container in instances:
        ports = container.ports
        c = {
            "id": container.short_id,
            "name": container.name,
            "status": container.status,
            "ports": ports
        }
        response.append(c)
    return jsonify(response)

@app.route('/stop_instances', methods=['POST'])
def stop_instances():
    data = request.json
    instance_id = data['instance_id']
    instance = client.containers.get(instance_id)
    instance.stop()
    return jsonify({"status": "stopped"})

@app.route('/terminate_instances', methods=['POST'])
def terminate_instances():
    data = request.json
    instance_id = data['instance_id']
    instance = client.containers.get(instance_id)
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
    for container in instances:
        if container.name == instance_name:
            c = client.containers.get(container_id=container.id)
            c.stop()
            c.remove()
            break
    volumes = []
    volumes.append({"source": source, "target": target})
    create_ec2_container(instance_name, 3022, volumes=volumes)
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