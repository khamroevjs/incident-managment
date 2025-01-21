import { ApplicationService, Request } from "@sap/cds";
import { Incident } from "#cds-models/ProcessorService";

module.exports = (srv: ApplicationService) => {
    srv.before('UPDATE', Incident, async (req: Request<Incident>) => {
        await onUpdate(req);
        console.log('Before update');
    });

    srv.before('CREATE', Incident, async (req: Request<Incident>) => {
        console.log('Before create');
        changeUrgencyDueToSubject(req.data);
    });

    function changeUrgencyDueToSubject(incident: Incident) {
        if (incident.title?.toLowerCase().includes('urgent')) {
            incident.urgency = { code: 'H' }
        }
    }

    async function onUpdate(req: Request<Incident>) {
        const result = await SELECT.one('status_code').from(Incident).where({ ID: req.data.ID }) as { status_code: string };
        if (result.status_code === 'C') {
            req.reject(400, 'Cannot update closed incident');
        }
    }
}