FROM justb4/jmeter:5.6.3

# Install extra plugins via PluginManager
RUN /opt/apache-jmeter/bin/PluginsManagerCMD.sh install \
    jpgc-casutg \
    influxdblistener \
    jpgc-json \
    jpgc-graphs-basic

# Optional: Increase memory
ENV JVM_ARGS="-Xms512m -Xmx1024m"
