//todo make it so that it generates a link to click

const addressColumns = [8,10,11,12,13,14,15,16,17];
const titleColumns = [32, 50, 68, 86, 104, 122, 140, 158, 176, 194, 212];

class Person{
    constructor(title, firstName, secondName) {
        this.title = title;
        this.firstName = firstName;
        this.secondName = secondName;
    }

    getTitleFirstname()
    {
        //todo handle this differently when there is no title?
        return this.title + " " + this.secondName;
    }
}

class Row{
    constructor(row)
    {
        this.row = this.splitRowToColumns(row);
        console.log(this.row);
        this.people = this.findPeople();
        console.log(this.people);
    }

    splitRowToColumns(row)
    {
        return row.split("\",\"");
    }

    findPeople()
    {
        let people = [];
        //const titleColumns = [32, 50, 68, 86, 104, 122, 140, 158, 176, 194, 212];
        for (let i = 0; i < titleColumns.length; i++)
        {
            const c = titleColumns[i];
            if (this.row[c+1] != undefined) {
                people.push(new Person(this.row[c], this.row[c + 1], this.row[c + 3]));
            }
            else {
                break;
            }
        }

        return people;
    }

    getAddressBlock()
    {
        //const addressColumns = [8,10,11,12,13,14,15,16,17];
        let address = []
        for(let i = 0; i < addressColumns.length; i++)
        {
            address.push(this.row[addressColumns[i]]);
        }

        return address;
    }

    getSalutationTitleFirstName(greeting)
    {
        if (this.people.length == 1)
        {
            return this.people[0].getTitleFirstname();
        }
        console.log(this.people);
        let salutation = new Array(this.people.length + (this.people.length-1) );
        let peeps = this.people;
        for(let i = 0; i < salutation.length; i++)
        {
            if (i % 2 == 0)
            {
                salutation[i] = peeps.shift().getTitleFirstname();
            }
            else {
                salutation[i] = ", ";
            }
        }
        salutation[salutation.length-2] = " and "
        return greeting + " " + salutation.join("");
    }
    getWard()
    {
        return this.row[4];
    }

    getRoadGroup()
    {
        return this.row[23];
    }

    getFullPeopleData()
    {
        const rowToReturn = [];
        for (let i = 0; i < titleColumns.length; i++)
        {
            rowToReturn.push(this.row[titleColumns[i]] == undefined ? "" : this.row[titleColumns[i]] );
            rowToReturn.push(this.row[titleColumns[i] + 1] == undefined ? "" : this.row[titleColumns[i] + 1]);
            rowToReturn.push(this.row[titleColumns[i] + 3] == undefined ? "" : this.row[titleColumns[i] + 3]);
        }

        return rowToReturn;
    }

}

class RoadGroups{
    constructor() {
        this.existingGroups = new Map();
        this.lastNumber = 1;
    }

    getAlteredGroupName(rgName, ward)
    {
        //todo what should happen when road group is blank?
        if (!this.existingGroups.has(rgName))
        {
            this.existingGroups.set(rgName, ward.substr(0, 3) + this.lastNumber);
            this.lastNumber++;
        }

        return this.existingGroups.get(rgName);
    }
}

function processText(text)
{
    console.log("Starting to process text");
    let rows = text.split("\n");
    const rg = new RoadGroups();
    for(let i = 1; i<rows.length; i++)
    {
        let temp = new Row(rows[i]);
        //sort out salutation
        rows[i] = [temp.getSalutationTitleFirstName("Dear")];

        //sort out address
        rows[i].push(...temp.getAddressBlock());

        //sort out road groups
        rows[i].push(rg.getAlteredGroupName(temp.getRoadGroup(), temp.getWard()));
        rows[i].push(temp.getRoadGroup());

        //add full details for individuals
        rows[i].push(...temp.getFullPeopleData());
    }

    createDownloadFile(rows);
}

function getHeaders(csvHeaderRow)
{
    // salutation, address, people
    console.log("Generating headers");
    console.log(csvHeaderRow);
    const headers = ["Salutation"];

    for(let i = 0; i < addressColumns.length; i++)
    {
        headers.push(csvHeaderRow[addressColumns[i]]);
    }
    headers.push("AlteredRoadGroup", "OriginalRoadGroup");

    for (let i = 0; i < titleColumns.length; i++)
    {
        headers.push(csvHeaderRow[titleColumns[i]]);
        headers.push(csvHeaderRow[titleColumns[i]+1]);
        headers.push(csvHeaderRow[titleColumns[i]+3]);
    }
    console.log(headers);
    return headers;
}

function createDownloadFile(data)
{
    console.log("Preparing download");
    data[0] = getHeaders(data[0].split("\",\""));

    for(let i = 0; i < data.length; i++)
    {
        for (let j = 0; j < data[i].length; j++)
        {
            data[i][j] = "\"" + data[i][j] + "\"";
        }
        data[i] = data[i].join(",");
    }

    const csv = "data:text/csv;charset=utf-8," + data.join("\n");
    const encodedUri = encodeURI(csv);
    window.open(encodedUri);

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