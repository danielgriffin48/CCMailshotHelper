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

    getHaveTitle()
    {
        if (this.title == undefined || this.title == "")
        {
            return false;
        }
        else{
            return true;
        }
    }

    getFirstNameLastName()
    {
        return this.firstName + " " + this.secondName;
    }
}

class Row{

    constructor(row, allFieldsClosedByDoubleQuotes)
    {
        this.allFieldsClosedByDoubleQuotes = allFieldsClosedByDoubleQuotes;
        this.row = this.splitRowToColumns(row);
        this.people = this.findPeople();
        //  console.log("========");
        //  console.log(this.row);
        // console.log(this.people);
        //  console.log("========");
    }

    getAllPeopleHaveTitle()
    {
        for (let i = 0; i < this.people.length ; i++)
        {
            if (!this.people[i].getHaveTitle())
            {
                return false;
            }
        }
        return true;
    }

    splitRowToColumns(row, allFieldsClosedByDoubleQuotes)
    {
        let rowSplitToColumns;
        if (this.allFieldsClosedByDoubleQuotes)
        {
            rowSplitToColumns = row.split("\",\"");
        }
        else {
            let first = row.split(",");
            rowSplitToColumns = [];
            let start;
            let i = 0;
            while (i < first.length) {
                if (first[i].charAt(0) == "\"") {
                    let temp = []
                    while (first[i].charAt(first[i].length - 1) != "\"") {
                        temp.push(first[i])
                        i++;
                    }
                    rowSplitToColumns.push(temp.join(""));

                } else {
                    rowSplitToColumns.push(first[i]);
                }
                i++;
            }
        }

        return rowSplitToColumns;
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
        // console.log("found " + people.length)
        // console.log(people)
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
            return greeting + " " + this.people[0].getTitleFirstname();
        }
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
        return "\""  + greeting + " " + salutation.join("") + "\"";
    }

    getSalutationFirstNameSecondName(greeting)
    {
        if (this.people.length == 1)
        {
            return greeting + " " + this.people[0].getFirstNameLastName();
        }
        let salutation = new Array(this.people.length + (this.people.length-1) );
        let peeps = this.people;
        for(let i = 0; i < salutation.length; i++)
        {
            if (i % 2 == 0)
            {
                salutation[i] = peeps.shift().getFirstNameLastName();
            }
            else {
                salutation[i] = ", ";
            }
        }
        salutation[salutation.length-2] = " and "
        return "\""  + greeting + " " + salutation.join("") + "\"";
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
""
function processText(text)
{
    console.log("Starting to process text");
    let rows = text.split(/\r\n|\n\r|\n|\r/);
    console.log("Rows length " + rows.length);
    // console.log("============ split rows =============")
    // console.log(rows);
    // console.log("============ end split rows =============")
    let allFieldsEnclosedByQuotes;
    if (rows[0].charAt(0) === "\"")
    {
        allFieldsClosedByDoubleQuotes = true;
        console.log(rows[0].charAt(0) + " Doubled quoted");
    }
    else {
        console.log(rows[0].charAt(0) + " NOT Doubled quoted");
        allFieldsClosedByDoubleQuotes = false;
    }

    const rg = new RoadGroups();
    console.log("LEGNTH OF ROWS " + rows.length);
    for(let i = 1; i<rows.length; i++)
    {
        let temp = new Row(rows[i], allFieldsClosedByDoubleQuotes);
        // if (!allFieldsEnclosedByQuotes && temp.row.length != 224)
        // {
        //     continue;
        // }
        console.log("THE ROW IS " + temp);

        //sort out salutation
        if (temp.getAllPeopleHaveTitle()) {
            rows[i] = [temp.getSalutationTitleFirstName("Dear")];
        }
        else {
            rows[i] = [temp.getSalutationFirstNameSecondName("Dear")];
        }

        //sort out address
        rows[i].push(...temp.getAddressBlock());

        //sort out road groups
        rows[i].push(rg.getAlteredGroupName(temp.getRoadGroup(), temp.getWard()));
        rows[i].push(temp.getRoadGroup());

        //add full details for individuals
        rows[i].push(...temp.getFullPeopleData());
        console.log(rows[i])
    }
    createDownloadFile(rows);
}

function getHeaders(csvHeaderRow)
{
    // salutation, address, people
    console.log("Generating headers");
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
    return headers;
}

function createDownloadFile(data)
{
    console.log("Preparing download");
    console.log(data);
    data[0] = getHeaders(data[0].split(","));

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

