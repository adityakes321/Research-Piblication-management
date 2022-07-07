const express = require("express");
var cors = require('cors')
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Cite = require("citation-js");

const fileUpload = require('express-fileupload')
const mongodb = require('mongodb')
const fs = require('fs')
const router = express.Router()
const mongoClient = mongodb.MongoClient
const binary = mongodb.Binary

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(
  "mongodb+srv://adityakes321:aditya@cluster0.mv35f.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log(" Mongoose is connected")
);


const journalsSchema = {
  IEEE_reference: String,
  unique_id: String,
  title_of_paper: String,
  name_of_authors: String,
  name_of_journal: String,
  publication_year: Number,
  ISSN_number: String,
  link_of_recognition: String,
  journal_type: String,
  month_of_publication: String,
  google_scholar_citation_count: Number,
  impact_factor: String,
  journal_h_index: String,
  indexing: {
    scopus: { type: Boolean, default: false },
    sci: { type: Boolean, default: false },
    other: { type: Boolean, default: false },
  },
  co_author: String,
  DOI_of_paper: String,
};

const conferenceSchema = {
  IEEE_reference: String,
  unique_id: Number,
  title_of_paper: String,
  name_of_authors: String,
  title_of_proceedings: String,
  name_of_conference: String,
  conference_type: String,
  publication_year: Number,
  ISSN_ISBN_number: Number,
  affiliate_institute: String,
  name_of_publisher: String,
  month_of_publication: String,
  indexed_in_scopus: String,
  scopus_citation_count: Number,
  google_scholar_citation_count: Number,
  conference_h_index: String,
  co_author: String,
  DOI_of_paper: String,
};



const journals = mongoose.model("journals", journalsSchema);
const conferences = mongoose.model("conferences", conferenceSchema);

const registrationSchema = {
  username: {
    type: String,
    unique: true,
  },
  email: String,
  password: String,
};
const registers = mongoose.model("registers", registrationSchema);

app.use(express.static(__dirname));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/homepage", (req, res) => {
  res.sendFile(__dirname + "/views/homepage.html");
});

app.get("/inputFile", (req, res) => {
  res.sendFile(__dirname + "/input_components/file_input.html");
});

app.get("/citation-data/", cors(), (req, res) => {
  const doi = req.query.doi
  console.log(doi)
  var data = new Cite(doi);

  data.get({
    formats: "json",
    type: "html",
    style: "citation-apa",
    lang: "en-US",
  });
  console.log(data.data);
  res.json(data.data);
});

app.post("/register", function (req, res) {
  let newRegister = new registers({
    username: req.body.u,
    email: req.body.e,
    password: req.body.p,
  });
  newRegister.save();
  res.redirect("/");
});

app.post("/", async function (req, res) {
  try {
    const user = req.body.Username;
    const pass = req.body.Password;
    console.log(`Username is ${user} and password is ${pass}`);

    const username = await registers.findOne({ username: user });
    console.log(username);

    if (username.password === pass) {
      res.redirect("/homepage");
    } else {
      res.send("invalid details");
    }
  } catch (error) {
    res.status(404).send(error);
  }
});

app.post("/journal", function (req, res) {
  let newJournal = new journals({
    IEEE_reference: req.body.fir,
    unique_id: req.body.ui,
    title_of_paper: req.body.top,
    name_of_authors: req.body.nofa,
    name_of_journal: req.body.noj,
    publication_year: req.body.py,
    ISSN_number: req.body.in,
    link_of_recognition: req.body.lor,
    journal_type: req.body.jt,
    month_of_publication: req.body.mop,
    google_scholar_citation_count: req.body.gscc,
    impact_factor: req.body.if,
    journal_h_index: req.body.jhi,
    indexing: {
      scopus: req.body.s,
      sci: req.body.sss,
      other: req.body.o,
    },
    co_author: req.body.ca,
    DOI_of_paper: req.body.dop,
    file: req.body.utp,
  });
  newJournal.save();
  res.redirect("/inputFile");
});

app.post("/conference", function (req, res) {
  let newConference = new conferences({
    IEEE_reference: req.body.fir,
    unique_id: req.body.ui,
    title_of_paper: req.body.top,
    name_of_authors: req.body.nofa,
    title_of_proceedings: req.body.topc,
    name_of_conference: req.body.noc,
    conference_type: req.body.ct,
    publication_year: req.body.py,
    ISSN_ISBN_number: req.body.in,
    affiliate_institute: req.body.aitp,
    name_of_publisher: req.body.nop,
    month_of_publication: req.body.mop,
    indexed_in_scopus: req.body.iis,
    scopus_citation_count: req.body.scc,
    google_scholar_citation_count: req.body.gscc,
    conference_h_index: req.body.chi,
    co_author: req.body.ca,
    DOI_of_paper: req.body.dop,
  });
  newConference.save();
  res.redirect("/homepage");
});


app.use(fileUpload())

app.post("/upload", (req, res) => {
    let file = { name: req.body.name, file: binary(req.files.uploadedFile.data) }
    insertFile(file, res)
})

function insertFile(file, res) {
    mongoClient.connect("mongodb+srv://adityakes321:aditya@cluster0.mv35f.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true }, (err, client) => {
        if (err) {
            return err
        }
        else {
            let db = client.db('test')
            let collection = db.collection('files')
            try {
                collection.insertOne(file)
                console.log('File Inserted')
            }
            catch (err) {
                console.log('Error while inserting:', err)
            }
            
            res.redirect('/homepage')
        }

    })
}


app.listen(3000, function () {
  console.log("server is running on port 3000");
});
