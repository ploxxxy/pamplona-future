import http from 'node:http'
import pino from 'pino'

const logger = pino({
  msgPrefix: '[Redirector] ',
  level: 'debug',
})

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<serverinstanceinfo>
  <address member="0">
      <valu>
          <hostname>localhost</hostname>
          <ip>hello world</ip>
          <port>25565</port>
      </valu>
  </address>
  <secure>0</secure>
  <trialservicename></trialservicename>
  <defaultdnsaddress>0</defaultdnsaddress>
</serverinstanceinfo>`

const server = http.createServer((req, res) => {
  logger.debug('[Redirector] Redirected')

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/xml')
  res.end(xml)
})

server.listen(42230, () =>
  logger.info('[Redirector] Redirector started')
)
