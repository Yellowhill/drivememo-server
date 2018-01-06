import mail from '../handlers/mail.js';
import moment from 'moment';

const drivememoEmail = async drivememoInfo => {
	//console.log('calling drivermemoooEmail', drivememoInfo);
	console.log('------:', drivememoInfo.driveAssignments);
	// const {
	//     driver,
	//     driveStartDate,
	//     driveEndDate,
	//     roadometerStartValue,
	//     roadometerEndValue,
	//     workRelatedDriving,
	//     workRelatedDrivingNoPay,
	//     totalMileage
	// } = req.body.drivememoInfo;
	//const {drivememoInfo} = req.body;
	const sumDrive = type =>
		drivememoInfo.driveAssignments.reduce((prev, curr) => {
			if (curr.assType == type) {
				return prev + parseInt(curr.cost);
			}
			return prev;
		}, 0);

	const cardDriveSum = sumDrive('cardDrive');
	const cashDriveSum = sumDrive('cashDrive');
	const invoiceDriveSum = sumDrive('invoiceDrive');
	const updatedDrivememoInfo = Object.assign({}, drivememoInfo, {
		driveStartDate: moment(drivememoInfo.driveStartDate).format('DD.MM.YYYY hh.mm'),
		driveEndDate: moment(drivememoInfo.driveStartDate).format('DD.MM.YYYY hh.mm'),
		cardDriveSum,
		cashDriveSum,
		invoiceDriveSum,
	});

	console.log('caaard driveee sums: ', cardDriveSum);
	await mail.send({
		cardDriveSum,
		cashDriveSum,
		driveStartDate: moment(drivememoInfo.driveStartDate).format('DD.MM.YYYY hh.mm'),
		driveEndDate: moment(drivememoInfo.driveStartDate).format('DD.MM.YYYY hh.mm'),
		invoiceDriveSum,
		drivememoInfo,
		filename: 'drivermemo',
		subject: 'Ajomuistio',
		sender: drivememoInfo.driver.email,
		recipient: {
			name: 'Päivi Riippi',
			email: 'paivi.riippi@email.com',
		},
	});
};

export default {
	drivememoEmail,
};
