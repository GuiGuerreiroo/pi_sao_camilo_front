const fs = require('fs');
const path = require('path');

function replace(file, search, replaceStr) {
    const filePath = path.join(__dirname, 'src', file);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(search, replaceStr);
    fs.writeFileSync(filePath, content, 'utf8');
}

function replaceAll(file, search, replaceStr) {
    const filePath = path.join(__dirname, 'src', file);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.split(search).join(replaceStr);
    fs.writeFileSync(filePath, content, 'utf8');
}

// athlete_home.tsx
replace('app/pages/athlete/athlete_home.tsx', /tickFormatter=\{\(val: any\) =>/g, 'tickFormatter={(val: string | number) =>');
replace('app/pages/athlete/athlete_home.tsx', /content=\{\(\{ active, payload, label \}: any\) => \{/g, 'content={({ active, payload }: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any');
replace('app/pages/athlete/athlete_home.tsx', /formatter=\{\(value: any\) =>/g, 'formatter={(value: number) =>');

// athlete_report.tsx
replace('app/pages/athlete/athlete_report.tsx', /import type \{ TrainingInterface \} from '\.\.\/\.\.\/interface\/TrainingInterface';\n/g, '');

// athlete_session_report.tsx
replace('app/pages/athlete/athlete_session_report.tsx', /FaChevronRight,\n/g, '');
replace('app/pages/athlete/athlete_session_report.tsx', /FaChevronRight ,/g, '');
replace('app/pages/athlete/athlete_session_report.tsx', /FaChevronRight,/g, '');
replace('app/pages/athlete/athlete_session_report.tsx', /const shortId = training\.training_id\.split\('-'\)\[0\];/g, '// eslint-disable-next-line @typescript-eslint/no-unused-vars\n        const shortId = training.training_id.split(\'-\')[0];');

// mid_session.tsx
replace('app/pages/athlete/mid_session.tsx', /FaChevronDown, FaEdit /g, '');
replace('app/pages/athlete/mid_session.tsx', /FaChevronDown, /g, '');
replace('app/pages/athlete/mid_session.tsx', /FaEdit,/g, '');
replace('app/pages/athlete/mid_session.tsx', /\(e: any\)/g, '(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)');

// new_session.tsx
replace('app/pages/athlete/new_session.tsx', /FaVolleyballBall,\n/g, '');
replace('app/pages/athlete/new_session.tsx', /FaVolleyballBall,/g, '');
replace('app/pages/athlete/new_session.tsx', /MdSportsTennis /g, '');

// post_session.tsx
replace('app/pages/athlete/post_session.tsx', /FiActivity, /g, '');
replace('app/pages/athlete/post_session.tsx', /catch \(err\) \{/g, 'catch (err) { // eslint-disable-line @typescript-eslint/no-unused-vars');

// pre_session.tsx
replace('app/pages/athlete/pre_session.tsx', /useEffect, /g, '');
replace('app/pages/athlete/pre_session.tsx', /Input, /g, '');

// config.tsx
replaceAll('app/pages/default/config.tsx', /: any/g, ': string | number | undefined'); 

// login.tsx
replace('app/pages/default/login.tsx', /\}, \[\]\);/g, '    // eslint-disable-next-line react-hooks/exhaustive-deps\n    }, []);');

// support_athlete_details.tsx
replace('app/pages/support/support_athlete_details.tsx', /import type \{ TrainingInterface, MODALITY \} from '\.\.\/\.\.\/interface\/TrainingInterface';/g, 'import type { MODALITY } from \'../../interface/TrainingInterface\';');
replace('app/pages/support/support_athlete_details.tsx', /FaVolleyballBall, /g, '');
replaceAll('app/pages/support/support_athlete_details.tsx', /function formatDuration\(totalMinutes: number\): string \{[\s\S]*?return `\$\{m\}min`;\n\}\n/g, '');
replaceAll('app/pages/support/support_athlete_details.tsx', /function intensityColor\(intensity: number\): string \{[\s\S]*?return "#ef4444";\n\}\n/g, '');
replaceAll('app/pages/support/support_athlete_details.tsx', /function dehydrationLevel\(pct: number\): \{ label: string; color: string \} \{[\s\S]*?return \{ label: "Alto", color: "#ef4444" \};\n\}\n/g, '');
replace('app/pages/support/support_athlete_details.tsx', /const safeTrainings = member\?.trainings \|\| \[\];/g, 'const safeTrainings = React.useMemo(() => member?.trainings || [], [member?.trainings]);');
replace('app/pages/support/support_athlete_details.tsx', /tickFormatter=\{\(val: any\) =>/g, 'tickFormatter={(val: string | number) =>');
replace('app/pages/support/support_athlete_details.tsx', /content=\{\(\{ active, payload, label \}: any\) => \{/g, 'content={({ active, payload }: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any');
replace('app/pages/support/support_athlete_details.tsx', /formatter=\{\(value: any\) =>/g, 'formatter={(value: number) =>');

// support_home.tsx
replace('app/pages/support/support_home.tsx', /import \{ FiChevronLeft \} from "react-icons\/fi";\n/g, '');
replace('app/pages/support/support_home.tsx', /import \{ AiOutlineAppstore \} from "react-icons\/ai";\n/g, '');
replace('app/pages/support/support_home.tsx', /import \{ HiOutlineUserGroup \} from "react-icons\/hi";\n/g, '');
replace('app/pages/support/support_home.tsx', /import \{ IoDocumentTextOutline, IoSettingsOutline \} from "react-icons\/io5";\n/g, '');

// support_session_history.tsx
replace('app/pages/support/support_session_history.tsx', /const trainings = member\?.trainings \|\| \[\];/g, 'const trainings = useMemo(() => member?.trainings || [], [member?.trainings]);');

// support_session_report.tsx
replace('app/pages/support/support_session_report.tsx', /FaChevronRight, /g, '');
replace('app/pages/support/support_session_report.tsx', /const shortId = training\.training_id\.split\('-'\)\[0\];/g, '// eslint-disable-next-line @typescript-eslint/no-unused-vars\n        const shortId = training.training_id.split(\'-\')[0];');

// AthleteRepositoryHttp.ts
replaceAll('app/repositories/AthleteRepositoryHttp.ts', /\(data: any\)/g, '(data: Record<string, unknown>)');

// axiosInterceptor.ts
replace('services/axiosInterceptor.ts', /catch \(e\) \{/g, 'catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars');

console.log("Done");
