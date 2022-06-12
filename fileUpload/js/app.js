const btn = document.getElementById("btn")
var fileInput = document.getElementById("file")



fileInput.onchange = (e) => {
    console.log(e.target.files[0]);
}

btn.onclick = () => {
    // console.log(fileSlice(fileInput.files[0], 1024*1000)[0].blob.text())
    var files = []
    var data = new FormData()
    let config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }





    let blobs = new Promise((resolve, reject) => {
        files = fileSlice(fileInput.files[0], 1024 * 1000);
        resolve("slicing done...")
    })


    blobs.then((msg) => {

        console.log(files)


    })
    .then(()=>{
        axios.get(`http://localhost:8080/?slices=${files.length}&size=${fileInput.files[0].size}`).then((res)=>{
            console.log(res.data);
        }).catch(e=>{
            console.log(e);
        })
    })
    
    // .then(() => {
    //     console.log(data.getAll("file"));
    // }).then(() => {
    //     console.log("Sending files to server...");
    // }).then(() => {
    //     files.forEach((file, index) => {
    //         data.append("file", file.blob)
    //         data.append("id", index)
    //         axios.post("http://localhost:3000", data, config).then((res) => {
    //             console.log(res.data)
    //             if ( window.history.replaceState ) {
    //                 window.history.replaceState( null, null, window.location.href );
    //             }
    //         }).catch(e=>{
    //             console.error("Error: "+e);
    //         })
    //     });
    // }).then(() => {
        
        // for (let i = 0; i < files.length; i++) {
        //     data.append("file", files[i].blob)
        //     data.append("id", i)
        //     axios.post("http://localhost:3000", data, config).then((res) => {
        //         console.log(res.data)
        //     })
        // }
        // data.append("file", files[0].blob)
        // data.append("id", 0)
        // axios.post("http://localhost:3000", data, config).then((res) => {
        //     console.log(res.data)
        // })
    // })
    .catch((e) => {
        console.error("error: " + e);
    })








}


function fileSlice(file, chunkSize) {
    let startPointer = 0;
    let endPointer = file.size;
    let chunks = [];
    while (startPointer < endPointer) {
        let newStartPointer = startPointer + chunkSize;
        chunks.push({
            blob: file.slice(startPointer, newStartPointer),
            size: file.slice(startPointer, newStartPointer).size,
            id: startPointer
        });
        startPointer = newStartPointer;
    }
    return chunks;
}
// How many chunk will be generated  length is 1000=1kB
function fileChunk(file, chunkSize) {
    let chSize = Math.ceil((file.size / chunkSize) / chunkSize)
    return {
        chunkSize: chunkSize,
        chunk: chSize
    }
}
// This function is to get the information of file
function fileInfo(file) {
    let info = {
        name: file.name,
        size: file.size, // Bytes
        type: file.type
    }
    return info
}