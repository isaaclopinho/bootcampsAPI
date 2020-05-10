const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//READ JSON FILES
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/data/bootcamps.json`, "utf-8")
);

//READ JSON FILES
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/data/courses.json`, "utf-8")
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);

    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();

    console.log("Data Deleted...".red.inverse);
    process.exit();
  } catch (error) {}
};


if(process.argv[2] == "-i"){
    importData();
}else if(process.argv[2] == "-d"){
    deleteData();
}