import session from 'koa-session';
const SessionCONFIG:Readonly<Partial<session.opts>> = Object.freeze({
    key: 'koa:sess',
    renew: true,
    rolling:false,
});

export default SessionCONFIG;
