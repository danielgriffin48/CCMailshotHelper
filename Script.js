/**
 * A script to make preparing Contact Creator files for direct mails easier.
 * It removes unnecessary data to prevent accidental disclosure, it handles combining names for greeting lines and
 * prevents road group names from being printed.
 *
 */

const addressColumns = [8,10,11,12,13,14,15,16,17];
const titleColumns = [32, 50, 68, 86, 104, 122, 140, 158, 176, 194, 212];

class Person{
    constructor(title, firstName, secondName) {
        this.title = title;
        this.firstName = firstName;
        this.secondName = secondName;
    }

    getTitleSecondName()
    {
        return this.title + " " + this.secondName;
    }

    getHaveTitle()
    {
        if (this.title == undefined || this.title == "")
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    getFirstNameLastName()
    {
        return this.firstName + " " + this.secondName;
    }
}

class Row{

    constructor(row, allFieldsClosedByDoubleQuotes, rg)
    {
        this.allFieldsClosedByDoubleQuotes = allFieldsClosedByDoubleQuotes;
        this.row = this.splitRowToColumns(row);
        this.people = this.findPeople();
        this.firstNameSecondNameColumn = this.getSalutationTitleSecondName("Dear");
        this.titleFirstNameSecondNameColumn = this.getSalutationFirstNameSecondName("Dear");
        this.FirstNameColumn = this.getSalutationFirstName("Dear");
        this.TitleSurnameColumn = this.getSalutationTitleSurname("Dear");
        this.alteredRoadGroup = rg.getAlteredGroupName(this.getRoadGroup(), this.getWard())
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
        let address = []
        for(let i = 0; i < addressColumns.length; i++)
        {
            address.push(this.row[addressColumns[i]]);
        }

        return address;
    }

    getSalutationTitleSecondName(greeting)
    {
        if (this.people.length == 1)
        {
            return greeting + " " + this.people[0].getTitleSecondName();
        }
        let salutation = new Array(this.people.length + (this.people.length-1) );
        let peeps = [...this.people];
        for(let i = 0; i < salutation.length; i++)
        {
            if (i % 2 == 0)
            {
                salutation[i] = peeps.shift().getTitleSecondName();
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
        // creates an array with enough space for each person plus commas and ands
        let salutation = new Array(this.people.length + (this.people.length-1) );
        let peeps = [...this.people];
        // loops through and either adds a comma or pops first person and takes their name
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
        // replaces final join with and
        salutation[salutation.length-2] = " and "
        return "\""  + greeting + " " + salutation.join("") + "\"";
    }

    getSalutationFirstName(greeting)
    {
        if (this.people.length === 1)
        {
            return greeting + " " + this.people[0].firstName;
        }
        let salutation = new Array(this.people.length + (this.people.length-1) );
        let peeps = [...this.people];
        // loops through and either adds a comma or pops first person and takes their name
        for(let i = 0; i < salutation.length; i++)
        {
            if (i % 2 == 0)
            {
                salutation[i] = peeps.shift().firstName;
            }
            else {
                salutation[i] = ", ";
            }
        }
        // replaces final join with and
        salutation[salutation.length-2] = " and "
        return "\""  + greeting + " " + salutation.join("") + "\"";
    }

    getSalutationTitleSurname(greeting)
    {
        if (this.people.length == 1)
        {
            return greeting + " " + this.people[0].getTitleSecondName();
        }
        let salutation = new Array(this.people.length + (this.people.length-1) );
        let peeps = [...this.people];
        for(let i = 0; i < salutation.length; i++)
        {
            if (i % 2 == 0)
            {
                salutation[i] = peeps.shift().getTitleSecondName();
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

    setFirstNameSecondNameColumn()
    {
        if (this.getAllPeopleHaveTitle()) {
            return this.getSalutationTitleFirstName("Dear");
        }
        else {
            return this.getSalutationFirstNameSecondName("Dear");
        }
    }

    getRowOutput()
    {
        let rowOutput = [ this.firstNameSecondNameColumn,
                        this.titleFirstNameSecondNameColumn,
                        this.FirstNameColumn,
                        this.TitleSurnameColumn,
                        this.getAddressBlock(),
                        this.alteredRoadGroup,
                        this.getRoadGroup(),
                        this.getFullPeopleData()
                        ];

        return rowOutput;
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
    let rows = text.split(/\r\n|\n\r|\n|\r/);
    console.log("Rows length " + rows.length);

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

    for(let i = 1; i<rows.length; i++)
    {
        let temp = new Row(rows[i], allFieldsClosedByDoubleQuotes, rg);
        rows[i] = temp.getRowOutput();
        // if (temp.getAllPeopleHaveTitle()) {
        //     rows[i] = [temp.getSalutationTitleFirstName("Dear")];
        // }
        // else {
        //     rows[i] = [temp.getSalutationFirstNameSecondName("Dear")];
        // }

        //sort out address
        // rows[i].push(...temp.getAddressBlock());

        //sort out road groups
        //rows[i].push(rg.getAlteredGroupName(temp.getRoadGroup(), temp.getWard()));
        // rows[i].push(temp.getRoadGroup());

        //add full details for individuals
        // rows[i].push(...temp.getFullPeopleData());
        console.log(rows[i])
    }
    createDownloadFile(rows);
}

function getHeaders(csvHeaderRow)
{
    // salutation, address, people
    console.log("Generating headers");
    const headers = ["TitleSecond", "TitleFirstSecond", "First", "TitleFirst"];

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

