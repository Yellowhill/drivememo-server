import mongoose from 'mongoose';
mongoose.Promise = global.Promise;


const drivememoSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    driver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'Muistion tallentaminen vaatii kuljettajan nimen'
    },
    driveStartDate: {
        type: Date,
        default: Date.now
    }, 
    driveEndDate: {
        type: Date,
        default: Date.now
    }, 
    roadometerStartValue: Number,
    roadometerEndValue: Number,
    workRelatedDriving: Number,
    workRelatedDrivingNoPay:Number,
    totalMileage: Number,
    driveAssignments: [{
        entryTime: Date,
        assType: String,
        cost: String,
        invoiceClient: String,
        invoiceTarget: String,
        typeOfDrive: String,
        modifiedDate: Date,
    }

    ],
    draft: Boolean
    // cardDrives: [{
    //     entryTime: Date,
    //     cost: Number,
    //     modifiedDate: Date,
    // }],
    // cashDrives: [{
    //     entryTime: Date,
    //     cost: Number,
    //     modifiedDate: Date,
    // }],
    // invoiceDrives: [{
    //         entryTime: Date,
    //         client: String,
    //         typeOfDrive: String,
    //         cost: String,
    //         modifiedDate: Date,
    // }],
});


function autopopulate(next) {
    this.populate('driver');
    next();
  }
  
  drivememoSchema.pre('find', autopopulate);
  drivememoSchema.pre('findOne', autopopulate);

export default mongoose.model('Drivememo', drivememoSchema);