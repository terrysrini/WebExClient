var request = require('request');
const xmlQuery = require('xml-query');
const XmlReader = require('xml-reader');
var Promise = require('promise');
         ${attendeess}
        </attendees>
      </participants>
      <attendeeOptions>
        <emailInvitations>true</emailInvitations>
      </attendeeOptions>
      <schedule>
        <openTime>300</openTime>
      </schedule>
    </bodyContent>
  </body>
</serv:message>`;
            request.post({
                headers: { 'content-type': 'application/xml' },
                url: 'https://apidemoeu.webex.com/WBXService/XMLService',
                body: rawbody
            }, function (error, response, body) {
                const ast = XmlReader.parseSync(body);
                const result = xmlQuery(ast).find('serv:result').text();
                console.log(body);
                session.send(result);
                resolve(result);
            });

        }).catch(function (errdata) {
            session.send(errdata);
            reject(errdata)
        })
    })

}
var CreateMeeting = function () {
    return new Promise(function (resolve, reject) {
        var r = {};
        let rawbody = `<?xml version="1.0" encoding="UTF-8"?>
<serv:message xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <header>
        <securityContext>
            <webExID>NuanceWebex</webExID>
            <password>#23_Srini</password>
            <siteName>apidemoeu</siteName>
        </securityContext>
    </header>
    <body>
        <bodyContent xsi:type="java:com.webex.service.binding.meeting.CreateMeeting">
            <metaData>
                <confName>${subjectMeeting + '-' + meetingPlace}</confName>
            </metaData>
            <schedule>
                <startDate/>
            </schedule>
        </bodyContent>
    </body>
</serv:message>`;
        request.post({
            headers: { 'content-type': 'application/xml' },
            url: 'https://apidemoeu.webex.com/WBXService/XMLService',
            body: rawbody
        }, function (error, response, body) {
            try {
                const ast = XmlReader.parseSync(body);
                const meeting_id = xmlQuery(ast).find('meet:meetingkey').text();
                const server_host = xmlQuery(ast).find('serv:host').text();
                const server_attd = xmlQuery(ast).find('serv:attendee').text();
                r.meeting_id = meeting_id;
                r.server_host = server_host;
                r.server_attd = server_attd;
                resolve(r);
            }
            catch (e) {
                reject(e);
            }

        });
    });
}

module.exports.SendMeeting = SendMeeting;
