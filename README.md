# Local EC2 Simulator

Run an EC2-like environment locally using Docker.

## Guide

This guide assumes you have Docker installed and accessible from your command line.

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ujjwal-kr/local-ec2
   ```

2. Navigate to the project directory:
   ```bash
   cd local-ec2
   ```

3. Launch the instance (this may take a few minutes):
   ```bash
   docker compose up --build -d
   ```

4. SSH into the container:
   ```bash
   ssh ubuntu@127.0.0.1 -p 3022
   ```
   Default password: `password`

5. To stop the container:
   ```bash
   docker compose down
   ```
   Add the `-v` flag to delete the associated volume on the host.

## Usage

This container simulates a remote server environment. You can clone repositories containing backend code and run them inside this virtual server.

To expose ports from your backend:

1. Edit the `EXPOSE` command in the Dockerfile:
   ```Dockerfile
   EXPOSE 22 80 443 [YOUR_PORT]
   ```

2. Add the port to the `ports` directive in the docker-compose.yml file:
   ```yml
   ports:
     - "3022:22"
     - "80:80"
     - "443:443"
     - "[HOST_PORT]:[CONTAINER_PORT]"
   ```


### Configuration

- The default password for the `ubuntu` user is `password`. You can change this in the Dockerfile.
- Adjust compute limits in the docker-compose.yml file. The current setup mimics a `t2.micro` instance.

### API (optional)

This also includes a AWS API if you need it for some reason.

1. Go to api folder by doing `cd ./api`.
1. Install the requirements by running `pip install -r requirements.txt`.
2. Run the API server using `python api.py`.
3. API docs will be released soon.

## Roadmap

1. Implement EC2 API compatibility.
   - Frontend Interface to do all this.
   - SSH via browser because why not.
2. Develop a custom Elastic Kubernetes Service.
3. Render AWS out of business.