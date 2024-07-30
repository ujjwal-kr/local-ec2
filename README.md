# Local EC2
Run an ec2 machine locally using docker (sort of).

## Guide

This assumes you have docker installed, and in path.

### Setup

- Clone the repo by

```bash
git clone https://github.com/ujjwal-kr/local-ec2
```

- Change directory to the project

```bash
cd ./local-ec2
```

- Fire the instance and have patience

```bash
docker compose up --build -d
```

- Now you can ssh into the container using

```bash
ssh ubuntu@1227.0.0.1 -p 3022
```

Default password is: `password`


### Config

- The default password for ubuntu is `password` but you can change it in the dockerfile.
- You can change the compute limits in the docker-compose file. Currently it is setup to behave as `t2-micro`.

## Roadmap
- Replicate APIs of EC2.
- Make my own Elastic Kubernetes Service.
- Render AWS out of business.