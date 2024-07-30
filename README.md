# Local EC2
Run an ec2 machine locally using docker (sort of).

## Guide

This assumes you have docker installed, and in path.

### Setup

Clone the repo by

```bash
git clone https://github.com/ujjwal-kr/local-ec2
```

Change directory to the project

```bash
cd ./local-ec2
```

Fire the instance and have patience

```bash
docker compose up --build -d
```

Now you can ssh into the container using

```bash
ssh ubuntu@1227.0.0.1 -p 3022
```

Default password is: `password`

You can turn off the container using:

```bash
docker compose down
```

Pass the -v flag above to delete the volume on host.

## Usage

You can use this container like a remote server. Clone a repository containing a backend and simply run it inside the server. For ports, you will have to edit the `EXPOSE` command of the Dockerfile and `ports` directive in the docker-compose file, so that the ports are available from outside the server.

You can add ports provided by your backend by adding them to the Dockerfile:

```Dockerfile
EXPOSE 22 80 443
```

And also add it to the `ports` of docker compose:

```yml
    ports:
      - "3022:22"
      - "80:80"
      - "443:443"
```


### Config

- The default password for ubuntu is `password` but you can change it in the dockerfile.
- You can change the compute limits in the docker-compose file. Currently it is setup to behave as `t2-micro`.

## Roadmap
- Replicate APIs of EC2.
- Make my own Elastic Kubernetes Service.
- Render AWS out of business.
