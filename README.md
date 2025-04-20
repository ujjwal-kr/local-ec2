# Local EC2

Run an EC2-like environment locally using Docker.

![image](https://github.com/user-attachments/assets/eca758ae-cc12-4356-9472-87fe897ebd2a)


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

3. Launch Local EC2:
   ```bash
   docker compose up -d
   ```

   Local EC2 will be running on port 3000 i guess.

## Roadmap

1. Implement EC2 API compatibility.
   - Frontend Interface to do all this. [on it]
   - SSH via browser because why not.
2. Develop a custom Elastic Kubernetes Service.
3. Render AWS out of business.
