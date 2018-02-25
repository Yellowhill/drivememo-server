import mongoose from 'mongoose';
import emailController from './emailController.js';
const Drivememo = mongoose.model('Drivememo');
const CardDrive = mongoose.model('CardDrive');
const CashDrive = mongoose.model('CashDrive');
const InvoiceDrive = mongoose.model('InvoiceDrive');

const addDrivememo = async (req, res, next) => {
	//TODO if it is a draft, add boolean here
	const {
		driveStartDate,
		driveEndDate,
		roadometerStartValue = 0,
		roadometerEndValue = 0,
		workRelatedDriving = 0,
		workRelatedDrivingNoPay = 0,
		totalMileage = 0,
		driveAssignments,
		draft,
	} = req.body.drivememo;

	if (req.body.drivememo._id) {
		Drivememo.findById(req.body.drivememo._id, (err, targetMemo) => {
			if (err) {
				console.log('Error in addDrivememo finding target ', err);
			} else {
				targetMemo.set({
					driveStartDate,
					driveEndDate,
					roadometerStartValue,
					roadometerEndValue,
					workRelatedDriving,
					workRelatedDrivingNoPay,
					totalMileage,
					driveAssignments,
					draft,
				});
				targetMemo.save((err, updatedMemo) => {
					if (err) {
						console.log('Error in addDrivememo update ', err);
					} else {
						emailController.drivememoEmail(updatedMemo);
						res.send(updatedMemo);
					}
				});
			}
		});
	} else {
		req.body.drivememo.driver = req.user._id;
		const drivememo = new Drivememo(req.body.drivememo);
		console.log('Drivememo before save: ', drivememo);
		await drivememo.save((err, drivememo) => {
			if (err) {
				console.log('Error in addDrivememo: ', err);
			} else {
				res.send(drivememo);
			}
		});
	}
};

const checkdraft = async (req, res, next) => {
	Drivememo.find({ driver: req.user._id, draft: true }, (err, draft) => {
		res.send(draft);
	});
};
//TODO get drivememos check wes boss video locking down our application with..
export default {
	addDrivememo,
	checkdraft,
};
/**
 * tallentaa
 *  -
 */
/**§		if (memos.length > 0) {
			Drivememo.findById(memos[0]._id, async (err, target) => {
				target.set({ ...req.body.drivememo });
				console.log('this is the target: ', target);
				await target.save();
			});
		} else {
			req.body.drivememo.driver = req.user._id;
			const drivememo = new Drivememo(req.body.drivememo);
			console.log('Drivememo before save: ', drivememo);
			await drivememo.save();
		} */
