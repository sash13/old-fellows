(function (window, undefined) {

    var Ds = function () {
        /*this.colorTablePixels = [];
        this.colorTable = [];
        this.xSize = 0;
        this.ySize = 0;*/
    }
/*
    var rleBit = 192;
    var colorTableSize = 256;
    var paletteOffset = -769;

    var exception = {
        notSupported: 0
    }

    var throwException = function (errorCode) {
        /// <summary>Throws an exception based on the error code</summary>
        /// <param name="errorCode" type="exception">An error code as defined by exception</param>

        switch (errorCode) {
            case DS3.exception.notSupported:
                throw {
                    name: 'NotSupported',
                    message: 'Only 256 color, version 5, pcx files are currently supported'
                }
                break;
        }
    }*/

    /*var loadHeader = function (reader) {
        /// <param name="reader" type="BinaryReader" />

        header = {}

        header.manufacturer = reader.readByte();
        header.version = reader.readByte();
        header.encoding = reader.readByte();
        header.bitsPerPixel = reader.readByte();

        header.xmin = reader.readInt16();
        header.ymin = reader.readInt16();
        header.xmax = reader.readInt16();
        header.ymax = reader.readInt16();
        header.hdpi = reader.readInt16();
        header.vdpi = reader.readInt16();

        // Skip over the reserved header bytes
        reader.seek(49, seekOrigin.current);

        header.nPlanes = reader.readByte();
        header.bytesPerPlane = reader.readInt16();

        return header;
    }*/

    //Pcx.prototype.loadFileAsync = function (item, callback) {
    Ds.prototype.load = function (typedArray) {
        /// <summary>Loads a PCX file from a TypedArray</summary>
        /// <param name="typedArray" type="TypedArray">A typed array that contains the pcx bytes</param>

        var binaryReader = new BinaryReader(typedArray);

        /*this.header = loadHeader(binaryReader);

        binaryReader.seek(128, seekOrigin.begin);

        if ((this.header.version === 5) && (this.header.bitsPerPixel === 8) &&
            (this.header.encoding === 1) && (this.header.nPlanes === 1)) {

            this.xSize = this.header.xmax - this.header.xmin + 1;
            this.ySize = this.header.ymax - this.header.ymin + 1;*/

            var count = 0;
            var node_num = 0;
            var vert_num = 0;
            var array_lenght = typedArray.length;
            alert(array_lenght);
            //alert(binaryReader.readByte());
            //alert(binaryReader.readUint16());
            while (binaryReader.streamPosition_seek() < array_lenght) {
                var chunk_id = binaryReader.readUint16();
                count+=2;
                var chunk_size  = binaryReader.readUint32();
                count+=4;
                alert(chunk_id);
                alert('chunk_size');
                alert(chunk_size);
                switch(chunk_id) {
                    case 19789: //MAIN CHUNK
                        alert('main');
                        break;
                    case 15677: //3D EDITOR CHUNK
                        alert('3D EDITOR CHUNK');
                        break;         
                    case 16384: //OBJECT BLOCK
                            alert('OBJECT BLOCK');
                            node_num++;
                            chari= 1;
                            i=0;
                            do {
                                chari = binaryReader.readByte();
                                i++;
                            } while(chari != 0 && i<20);
                            count+=i;
                            //binaryReader.seek(6, seekOrigin.current);
                        break; 
                    case 16640: //TRIANGULAR MESH
                        alert('TRIANGULAR MESH');
                        break; 
                    case 16672: //FACES DESCRIPTION
                            alert('FACES DESCRIPTION');
                            vert_num+=binaryReader.readUint16()*3;
                            alert('Number of polygons:');
                            alert(vert_num/3);
                            count+=(chunk_size - 6);
                            alert('position');
                            alert(binaryReader.streamPosition_seek());
                            binaryReader.seek((chunk_size - 6), seekOrigin.current);
                        break; 
                    default:
                            count += (chunk_size - 6);
                            binaryReader.seek((chunk_size - 6), seekOrigin.current);
                            alert('default');
                        break;
                }
                /*if ((processByte & rleBit) === rleBit) {
                    processByte &= 63;
                    var colorByte = binaryReader.readByte();

                    for (var index = 0; index < processByte; index++) {
                        this.colorTablePixels[count] = colorByte;
                        count++;
                    }
                }
                else {
                    this.colorTablePixels[count] = processByte;
                    count++;
                }*/
                
            }
            alert(node_num);
            alert(vert_num);
            /*binaryReader.seek(paletteOffset, seekOrigin.end);

            var paletteIndicator = binaryReader.readByte();

            for (var index = 0; index < colorTableSize; index++) {
                this.colorTable[index] = {
                    red: binaryReader.readByte(),
                    green: binaryReader.readByte(),
                    blue: binaryReader.readByte()
                }
            }*/
        //}
    }

    /*Pcx.prototype.drawToCanvas = function (canvas) {
        /// <summary>Draws the loaded pcx to a canvas</summary>

        var context = canvas.getContext('2d');
        var height = Math.min(this.ySize, canvas.height);
        var width = Math.min(this.xSize, canvas.width);
        var outputData = context.createImageData(width, height);

        for (var yIndex = 0; yIndex < height; yIndex++) {
            for (var xIndex = 0; xIndex < width; xIndex++) {
                var outputOffset = yIndex * (width * 4) + (xIndex * 4);
                var pcxOffset = yIndex * this.xSize + xIndex;
                var pixel = this.colorTable[this.colorTablePixels[pcxOffset]];

                outputData.data[outputOffset] = pixel.red;
                outputData.data[outputOffset + 1] = pixel.green;
                outputData.data[outputOffset + 2] = pixel.blue;
                outputData.data[outputOffset + 3] = 255;
            }
        }

        context.putImageData(outputData, 0, 0);
    }*/

    window.Ds = Ds;
})(window);