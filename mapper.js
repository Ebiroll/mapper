/* 
var a_lat = parseInt(msg.payload.buffer[0],16) +  parseInt(msg.payload.buffer[1],16) << 8 +  parseInt(msg.payload.buffer[2],16) << 16 +  parseInt(msg.payload.buffer[3],16) << 24;
var tmp_hex_lat = msg.payload.substr(0, 8);
var tmp_hex_lon = msg.payload.substr(8, 8);
var a = parseInt(tmp_hex_lat, 16);
if ((a & 0x80000000) > 0) {
   a = a - 0x100000000;
}
var b = parseInt(tmp_hex_lon, 16);
if ((b & 0x80000000) > 0) {
   b = b - 0x100000000;
}
plot.lat = a/1e6;
plot.lon = b/1e6;           


7D B1 6D 42 7F A3 8E 41

9A B1 6D 42
43 A3 8E 41

426D = 17005
B19A = 45466


418E = 16782
A343 = 41795

59.4232328
17.829832


*/


module.exports = function(RED) {
    function MapperNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            var plot = {}
            plot.name = "test"
            if (true /*msg.payload.len()>7*/) {
                var deg_lat =  msg.payload[2] +  (msg.payload[3] << 8 );
                var min_lat =  msg.payload[0] +  (msg.payload[1] << 8);
                var deg_lon = msg.payload[6] + (msg.payload[7] << 8);
                var min_lon = msg.payload[4] + (msg.payload[5] << 8);


                plot.lat = deg_lat/1000 + min_lat/60000;
                plot.lon = deg_lon/1000 + min_lon/60000;  
            }
            plot.payload=msg.payload;
                         
            // 79B16D42 CDA28E41
            //{name:"Joe", lat:51, lon:-1.05}
            //msg.payload = msg.payload.toLowerCase();
            node.send(plot);
        });
    }
    RED.nodes.registerType("mapper",MapperNode);
}