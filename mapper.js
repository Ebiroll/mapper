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
        function Bytes2Float32(bytes)
        {
            var sign = (bytes & 0x80000000) ? -1 : 1;
            var exponent = ((bytes >> 23) & 0xFF) - 127;
            var significand = (bytes & ~(-1 << 23));
        
            if (exponent == 128) 
                return sign * ((significand) ? Number.NaN : Number.POSITIVE_INFINITY);
        
            if (exponent == -127) {
                if (significand == 0) return sign * 0.0;
                exponent = -126;
                significand /= (1 << 22);
            } else significand = (significand | (1 << 23)) / (1 << 23);
        
            return sign * significand * Math.pow(2, exponent);
        }        
        node.on('input', function(msg) {
            var plot = {}
            plot.name = "test" + msg.payload[0];
            if (true /*msg.payload.len()>7*/) {
                // bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
                var lat = (msg.payload[3] << 24)  +  (msg.payload[2] << 16 ) +  (msg.payload[1] << 8 ) + msg.payload[0];
                var lon = (msg.payload[7] << 24)  +  (msg.payload[6] << 16 ) +  (msg.payload[5] << 8 ) + msg.payload[4]
         

                plot.lat =  Bytes2Float32(lat);
                plot.lon = Bytes2Float32(lon);  
                plot.layer = 'lora';
            }
            //plot.payload=msg.payload;
                         
            // 79B16D42 CDA28E41
            //{name:"Joe", lat:51, lon:-1.05}
            //msg.payload = msg.payload.toLowerCase();
            plot.icon='wifi';
            var msg;        
            msg.payload=plot;
            msg.data=plot; 
            //node.send(JSON.stringify(msg));
            node.send(msg);
        });
    }
    RED.nodes.registerType("mapper",MapperNode);
}