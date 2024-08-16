import AirtablePlus from "airtable-plus";
import { ensureAuthed } from "../login/test";

export default async function handler(req, res) {
    const { ID } = req.query
    const user = await ensureAuthed(req)
  if (user.error) {
    return res.status(401).json(user)
  }

  const airtable = new AirtablePlus({
        apiKey: process.env.AIRTABLE_API_KEY,
        baseID: 'app4kCWulfB02bV8Q',
    tableName: "Showcase"
  })

  const project = await airtable.read({
    filterByFormula: `AND({User} = '${user.fields['Name']}', {ID} = '${ID}')`
})

  const results = project.map(p => ({
    id: p.id,
    title: p.fields['Name'] || '',
    desc: p.fields['Description'] || '',
    slackLink: p.fields['Slack Link'] || '',
    codeLink: p.fields['Code Link'] || '',
    slackLink: p.fields['Slack Link'] || '',
    playLink: p.fields['Play Link'] || '',
    images: p.fields['Screenshot'].map(i => i.url) || [],
    githubProf: p.fields['Github Profile'] || ''
  }))
  return res.status(200).json({ project: results[0] })
}