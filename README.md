# 🚀 Local EC2

Spin up cloud-style EC2 right on your local setup using Docker. Perfect for test runs, flexin’ infra skills, or building that next big thing.

[![Dashboard Preview](https://github.com/user-attachments/assets/eca758ae-cc12-4356-9472-87fe897ebd2a)](https://github.com/user-attachments/assets/eca758ae-cc12-4356-9472-87fe897ebd2a)

---

## Motivation
- This can be used for testing within clusters without the hassle of vms.
- We also use it personally for training people about devops.
- Plan to implement dev environments using docker managable via a master node. How cool.

---

## What You Need

Before you pull up:

- Docker 20.10+ 
- Python 3.8+ 
- Node.js 16+ & npm

---

## Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/ujjwal-kr/local-ec2
   cd local-ec2
   ```

2. **Start the backend**
   ```bash
   python -m venv env
   source env/bin/activate        # Mac/Linux
   env\Scripts\activate           # Windows

   pip install -r requirements.txt
   python api.py                  # Fires up on port 6969
   ```

3. **Spin the frontend**
   ```bash
   cd ui
   npm install
   npm run dev                    # Hit it at http://localhost:3000
   ```

---

## Roadmap

1. Implement EC2 API compatibility.
   - Frontend Interface to do all this. [on it]
   - SSH via browser because why not.
2. Develop a custom Elastic Kubernetes Service.
3. Render AWS out of business.

---

**⚠️ Disclaimer:** Not affiliated in any way by AWS.