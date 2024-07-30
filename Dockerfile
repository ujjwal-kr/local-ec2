FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
    sudo \
    curl \
    wget \
    unzip \
    vim \
    git \
    openssh-server \
    build-essential \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN echo "ubuntu:password" | chpasswd
RUN usermod -aG sudo ubuntu

RUN mkdir /var/run/sshd
RUN ssh-keygen -A

EXPOSE 22

USER root
CMD ["/usr/sbin/sshd", "-D"]