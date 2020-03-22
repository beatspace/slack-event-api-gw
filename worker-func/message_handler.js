const _ = require('lodash');
const { WebClient } = require('@slack/web-api');
const Firestore = require('@google-cloud/firestore');

// Slack WebAPI
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

// Firestore
const db = new Firestore({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.KEY_FILENAME
});

let myUserId = null;


class MessageHandler {
    /**
     * Slackのメッセージイベントのハンドラ
     * @param data
     * @param context
     * @returns {Promise<void>}
     */
    async handle(data, context) {
        const pubSubMessage = data;
        const msg = pubSubMessage.data
            ? JSON.parse(Buffer.from(pubSubMessage.data, 'base64').toString())
            : {};
        console.log("handle=======================================>");
        console.log(JSON.stringify(msg));

        const myId = await this.updateMyUserId();
        //console.log(`myId:${myId}`);

        // BOT自信でなければ適当に返信
        if (msg.user !== myId) {
            const txt =  _.get(msg, 'text', 'Hello, world');
            const result = await web.chat.postMessage({
                text: `${txt} リターン`,
                channel: msg.channel,
            });
            console.log(result);
        }
    }

    async updateMyUserId() {
        // キャッシュあり
        if (myUserId !== null) {
            console.log(`キャッシュヒット:${myUserId}`);
            return myUserId;
        }

        // Firestoreから取得
        const configRef = db.collection('config').doc('current');
        const doc = await configRef.get();
        // DBに保存がある
        if (doc.exists) {
            const current = doc.data();
            myUserId = current.user_id;
            console.log(`DBキャッシュヒット:${myUserId}`);
            return myUserId;
        }

        // auth.testから取得
        const ret = await web.auth.test();
        myUserId = ret.user_id;

        // Firestoreへ保存
        const docRef = db.collection('config').doc('current');
        await docRef.set({ user_id: ret.user_id });

        console.log(`aut.test:${myUserId}`);
        return myUserId;
    }
}

module.exports = MessageHandler;

