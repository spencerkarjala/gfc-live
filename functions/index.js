const functions = require('firebase-functions');
const admin     = require('firebase-admin');
admin.initializeApp();

// When a new pledge is created, add 1 to the total number of pledges in
// the GFC FireStore database.
exports.addPledgeCount = functions.firestore
    .document('pledges/{newPledge}')
    .onCreate((snap, context) => {

        const pledgeCountRef = admin.firestore()
            .collection('totals')
            .doc('total_pledges');

        // Return a promise that adds one to the total number of pledges
        return pledgeCountRef.get().then(snap => {
            const total_pledges = snap.data().total_pledges + 1;
            const data = { total_pledges };
            return pledgeCountRef.update(data);
        })
    })

// When a pledge is deleted, subtract 1 from the total number of pledges
// in the GFC FireStore database.
exports.removePledgeCount = functions.firestore
    .document('pledges/{newPledge}')
    .onDelete((snap, context) => {

        const pledgeCountRef = admin.firestore()
            .collection('totals')
            .doc('total_pledges');

        // Return a promise that subtracts one from the total number of pledges
        return pledgeCountRef.get().then(snap => {
            const total_pledges = snap.data().total_pledges - 1;
            const data = { total_pledges };
            return pledgeCountRef.update(data);
        })
    })

// When a new pledge is created and added to the GFC FireStore database,
// take the amount pledged and add it to the running total.
exports.addNewPledgeToTotalSavings = functions.firestore
    .document('pledges/{newPledge}')
    .onCreate((snap, context) => {

        const amountToAdd = snap.data().totalPledge;
        const totalRef    = admin.firestore()
            .collection('totals')
            .doc('total_savings');

        // Return a promise that adds the desired amount to the total
        return totalRef.get().then(snap => {
            const total_savings = snap.data().total_savings + amountToAdd;
            const data = { total_savings };
            return totalRef.update(data);
        })
    })

// When a pledge is removed from the GFC FireStore dtabase, take the amount
// that was previously pledged and remove it from the running total.
exports.removePledgeFromTotalSavings = functions.firestore
    .document('pledges/{newPledge}')
    .onDelete((snap, context) => {

        const amountToRemove = snap.data().totalPledge;
        const totalRef       = admin.firestore()
            .collection('totals')
            .doc('total_savings');

        // Return a promise that removes the desired amount from the total
        return totalRef.get().then(snap => {
            const total_savings = snap.data().total_savings - amountToRemove;
            const data = { total_savings };
            return totalRef.update(data);
        })
    })

exports.updateTotalSavings = functions.firestore
    .document('pledges/{newPledge}')
    .onUpdate((change, context) => {

        const prevPledge = change.before.data().totalPledge;
        const currPledge = change.after.data().totalPledge;

        const valToUpdate = currPledge - prevPledge;
        const totalRef    = admin.firestore()
            .collection('totals')
            .doc('total_savings');

        // Return a promise that updates the total savings
        return totalRef.get().then(snap => {
            const total_savings = snap.data().total_savings + valToUpdate;
            const data = { total_savings };
            return totalRef.update(data);
        })
    })