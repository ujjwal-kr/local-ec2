from flask import Flask, request, jsonify
import docker

app = Flask(__name__)
client = docker.from_env()

# @app.route('/run_instances', methods=['POST'])
# def run_instances():
#     data = request.json
#     image = data.get('image', 'ubuntu:latest')
#     command = data.get('command', 'sleep infinity')
#     instance = client.containers.run(image, command, detach=True)
#     return jsonify({"instance_id": instance.id})

@app.route('/describe_instances', methods=['GET'])
def describe_instances():
    response = []
    instances = client.containers.list()
    for container in instances:
        ports = list(container.ports.keys())
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969)