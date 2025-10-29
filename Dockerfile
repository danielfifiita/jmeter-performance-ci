# Step 1: Base image and maintainer
FROM ubuntu:20.04

LABEL maintainer="yourname@domain.com"
ENV DEBIAN_FRONTEND=noninteractive

# Step 2: Define versions and JMeter paths
ARG JMETER_VERSION="5.6.3"
ENV JMETER_HOME /opt/apache-jmeter-${JMETER_VERSION}
ENV JMETER_BIN ${JMETER_HOME}/bin
ENV JMETER_LIB ${JMETER_HOME}/lib
ENV JMETER_PLUGINS ${JMETER_LIB}/ext

# Step 3: Install dependencies
RUN apt-get update && apt-get install -y \
    wget curl unzip git openjdk-11-jre-headless ca-certificates && \
    update-ca-certificates

# Step 4: Download and extract JMeter
WORKDIR /opt
RUN wget https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-${JMETER_VERSION}.tgz && \
    tar -xzf apache-jmeter-${JMETER_VERSION}.tgz && \
    rm apache-jmeter-${JMETER_VERSION}.tgz

# Step 5: Install CASUTG plugin manually (no PluginManager)
WORKDIR ${JMETER_HOME}
RUN wget https://jmeter-plugins.org/files/packages/jpgc-casutg-2.10.zip && \
    unzip jpgc-casutg-2.10.zip -d casutg-plugin && \
    mv casutg-plugin/lib/*.jar ${JMETER_LIB} && \
    rm -rf casutg-plugin jpgc-casutg-2.10.zip

# Step 6: Optional — install other plugins manually if needed
# Repeat same pattern as above for other plugins

# Step 7: Set environment and default command
ENV PATH=${JMETER_BIN}:$PATH
WORKDIR ${JMETER_HOME}
CMD ["jmeter", "--version"]
