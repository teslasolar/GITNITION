def scanGateways():
    """Scan network for Ignition gateways"""
    import system
    return system.net.httpGet("http://localhost:8090/StatusPing")
