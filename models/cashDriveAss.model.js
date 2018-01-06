import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const cashDriveSchema = new mongoose.Schema({
    drivememo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Drivememo',
        required: 'Cash drive assignment requires a drivememo'
    },
    entryTime: {
        type: Date,
        required: 'Cash drive entry time is required'
    },
    cost: {
        type: Number,
        required: 'Cash drive entry needs a cost'
    }
});


function autopopulate(next) {
    this.populate('drivememo');
    next();
  }
  
  cashDriveSchema.pre('find', autopopulate);
  cashDriveSchema.pre('findOne', autopopulate);

export default mongoose.model('CashDrive', cashDriveSchema);