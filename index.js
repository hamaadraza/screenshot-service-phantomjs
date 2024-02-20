const fastify = require('fastify')({ logger: true });
const phantom = require('phantom');

fastify.get('/', async function handler (request, reply) {
    if(!request.query?.url) {
        return reply.code(403)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send({ message: 'Url is must!' });
    }
    const instance = await phantom.create([], {
        phantomPath: '/usr/local/bin/phantomjs',
    });
    const page = await instance.createPage();
    page.property('viewportSize', { width: 1280, height: 800 });
    await page.open(request.query.url);
    //const title = await page.property('title');
    const screenshot = await page.renderBase64('PNG');
    instance.exit();
    
    const toSendBuffer = Buffer.from(screenshot, 'base64');
    reply.header('Content-Type', 'image/png');
    reply.send(toSendBuffer);
})

fastify.listen({ host: '0.0.0.0', port: 8000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})