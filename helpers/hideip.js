exports.hideIp = (ip) => {
    const octets = ip.split(".");
    if (octets.length !== 4) {
        throw new Error("Invalid IP address format");
    }
    return `${octets[0]}.***.***.***`;
};