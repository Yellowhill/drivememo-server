import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const invoiceDriveSchema = new mongoose.Schema({
    drivememo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Drivememo',
        required: 'Invoice drive assignment requires a drivememo'
    },
    entryTime: {
        type: Date,
        required: 'Invoice drive entry time is required'
    },
    cost: {
        type: String,
        required: 'Invoice drive entry needs a cost'
    }
});


function autopopulate(next) {
    this.populate('drivememo');
    next();
  }
  
  invoiceDriveSchema.pre('find', autopopulate);
  invoiceDriveSchema.pre('findOne', autopopulate);

export default mongoose.model('InvoiceDrive', invoiceDriveSchema);