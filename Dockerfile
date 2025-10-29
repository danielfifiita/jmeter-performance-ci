# Step 1
FROM ubuntu:20.04

LABEL maintainer="yourname@domain.com"
ENV DEBIAN_FRONTEND=noninteractive

# Step 2: Define versions
ARG JMETER_VERSION="5.6.3"
ARG CMDRUNNER_JAR_VERSION="2.2.1"
ARG JMETER_PLUGINS_MANAGER_VERSION="1.6"
ENV JMETER_HOME=/opt/apache-jmeter-${JMETER_VERSION}
ENV JMETER_BIN=${JMETER_HOME}/bin
ENV JMETER_LIB=${JMETER_HOME}/lib
ENV JMETER_PLUGINS=${JMETER_LIB}/ext

# Step 3: Install dependencies
RUN apt-get update && apt-get install -y \
    wget curl unzip git openjdk-11-jre-headless ca-certificates && \
    update-ca-certificates

# Step 4: Download and extract JMeter
WORKDIR /opt
RUN wget https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-${JMETER_VERSION}.tgz && \
    tar -xzf apache-jmeter-${JMETER_VERSION}.tgz && \
    rm apache-jmeter-${JMETER_VERSION}.tgz


# Step 5: Download and install PluginManager + CmdRunner
WORKDIR ${JMETER_LIB}
RUN wget https://repo1.maven.org/maven2/kg/apc/cmdrunner/${CMDRUNNER_JAR_VERSION}/cmdrunner-${CMDRUNNER_JAR_VERSION}.jar

WORKDIR ${JMETER_PLUGINS}
RUN wget https://repo1.maven.org/maven2/kg/apc/jmeter-plugins-manager/${JMETER_PLUGINS_MANAGER_VERSION}/jmeter-plugins-manager-${JMETER_PLUGINS_MANAGER_VERSION}.jar

# Step 6: Download PluginsManagerCMD.sh
WORKDIR ${JMETER_BIN}
RUN wget https://raw.githubusercontent.com/undera/jmeter-plugins/master/bin/PluginsManagerCMD.sh && \
    chmod +x PluginsManagerCMD.sh

# Step 7: Install plugins
WORKDIR ${JMETER_LIB}
RUN java -cp ${JMETER_LIB}/cmdrunner-${CMDRUNNER_JAR_VERSION}.jar \
    org.jmeterplugins.repository.PluginManagerCMD install \
    jpgc-casutg \
    influxdblistener \
    jpgc-json \
    jpgc-graphs-basic

# Step 8: Set path and default command
ENV PATH="${JMETER_BIN}:${PATH}"
WORKDIR ${JMETER_HOME}
CMD ["jmeter", "--version"]
