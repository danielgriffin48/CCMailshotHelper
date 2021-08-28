function processText(text)
{
    let rows = text.split(/\r\n|\n\r|\n|\r/);
    for (let i = 0; i<rows.length; i++)
    {
        let cols = rows[i].split(",");
        cols[0] = "flatulent";
        console.log(rows[i]);
    }

}

function createDownloadFile(data)
{
    console.log("download");
}

function readFile() {
    const input = document.getElementById("file_upload");
    let file = input.files[0];
    let fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = function() {
      processText(fileReader.result);
    };
}

document.getElementById("file_upload").addEventListener("change", readFile);