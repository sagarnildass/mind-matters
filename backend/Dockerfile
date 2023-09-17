# FROM python:3.9
# FROM nvidia/cuda:11.6.2-cudnn8-devel-ubuntu20.04

# ARG DEBIAN_FRONTEND=noninteractive TZ=Asia/Kolkata apt-get -y install tzdata

# RUN apt-get clean && apt-get update && apt-get -y install cmake protobuf-compiler libgomp1 python3.9 python3-pip 
# RUN apt-get -y install libgl1
# RUN apt-get install -y libglib2.0-0 libsm6 libxrender1 libxext6
# RUN pip install virtualenv
# ENV VIRTUAL_ENV=/venv
# RUN virtualenv venv -p python3
# ENV PATH="VIRTUAL_ENV/bin:$PATH"

# WORKDIR /artelus

# COPY . /artelus/


# RUN pip install --upgrade setuptools
# RUN pip install --upgrade pip && \
#     pip install --trusted-host pypi.python.org -r requirements.txt
# # RUN pip install torch==1.12.1+cu113 torchvision==0.13.1+cu113 --extra-index-url https://download.pytorch.org/whl/cu113

# EXPOSE 8000

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# FROM python:3.9
FROM nvidia/cuda:11.8.0-cudnn8-devel-ubuntu22.04

ARG DEBIAN_FRONTEND=noninteractive

# Update and install necessary dependencies
RUN apt-get clean && apt-get update && \
    apt-get -y install tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Kolkata /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata && \
    apt-get -y install cmake protobuf-compiler libgomp1 && \
    apt-get -y install libgl1 libglib2.0-0 libsm6 libxrender1 libxext6

# Install python3.9
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && \
    apt-get install -y python3.9 python3.9-venv python3.9-dev

# Ensure python3.9 is the default python3
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.9 1

WORKDIR /artelus

COPY . /artelus/

# Set up virtual environment
ENV VIRTUAL_ENV=/venv
RUN python3.9 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Upgrade pip and install the required packages
RUN pip install --upgrade setuptools
RUN pip install --upgrade pip && \
    pip install --trusted-host pypi.python.org -r requirements.txt
RUN pip install uvicorn[standard]==0.23.2
# RUN pip install torch==1.12.1+cu113 torchvision==0.13.1+cu113 --extra-index-url https://download.pytorch.org/whl/cu113

EXPOSE 8000

# Add Redis installation
RUN apt-get install -y redis-server

# Commands to start both Redis and your application (using a simple shell script)
RUN echo "#!/bin/sh\nredis-server &\nuvicorn main:app --host 0.0.0.0 --port 8000 --reload" > start.sh && \
    chmod +x start.sh

CMD ["./start.sh"]

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

