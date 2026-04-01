/**
 * Seed script — run with: node src/seed.js
 * Seeds: prefectures, users, clinics, jobs, applications
 */
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'Fidel@123',
  database: process.env.DB_NAME     || 'dental_recruitment',
})

async function seed() {
  const client = await pool.connect()
  try {
    console.log('Starting seed...')
    await client.query('BEGIN')

    // Ensure all columns exist (safe if table was created by TypeORM without them)
    const alterColumns = [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS prefecture      text`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS qualifications  text[]`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "experienceyears" integer`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "employmenttypes" text[]`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "desiredsalarymin" numeric`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS bio             text`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS provider        text NOT NULL DEFAULT 'email'`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "lineid"        text`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS "deletedat"     timestamptz`,
      `ALTER TABLE clinics ADD COLUMN IF NOT EXISTS "deletedat"   timestamptz`,
      `ALTER TABLE jobs    ADD COLUMN IF NOT EXISTS "deletedat"   timestamptz`,
      `ALTER TABLE jobs    ADD COLUMN IF NOT EXISTS "isfeatured"  boolean NOT NULL DEFAULT false`,
      `ALTER TABLE applications ADD COLUMN IF NOT EXISTS "deletedat" timestamptz`,
    ]
    for (const sql of alterColumns) {
      await client.query(sql)
    }
    console.log('  columns ensured')

    // prefectures
    await client.query(`
      CREATE TABLE IF NOT EXISTS prefectures (
        id     serial PRIMARY KEY,
        code   text NOT NULL UNIQUE,
        name   text NOT NULL,
        region text NOT NULL
      )
    `)
    const prefs = [
      ['01','北海道','北海道'],['02','青森県','東北'],['03','岩手県','東北'],['04','宮城県','東北'],
      ['05','秋田県','東北'],['06','山形県','東北'],['07','福島県','東北'],['08','茨城県','関東'],
      ['09','栃木県','関東'],['10','群馬県','関東'],['11','埼玉県','関東'],['12','千葉県','関東'],
      ['13','東京都','関東'],['14','神奈川県','関東'],['15','新潟県','中部'],['16','富山県','中部'],
      ['17','石川県','中部'],['18','福井県','中部'],['19','山梨県','中部'],['20','長野県','中部'],
      ['21','岐阜県','中部'],['22','静岡県','中部'],['23','愛知県','中部'],['24','三重県','近畿'],
      ['25','滋賀県','近畿'],['26','京都府','近畿'],['27','大阪府','近畿'],['28','兵庫県','近畿'],
      ['29','奈良県','近畿'],['30','和歌山県','近畿'],['31','鳥取県','中国'],['32','島根県','中国'],
      ['33','岡山県','中国'],['34','広島県','中国'],['35','山口県','中国'],['36','徳島県','四国'],
      ['37','香川県','四国'],['38','愛媛県','四国'],['39','高知県','四国'],['40','福岡県','九州'],
      ['41','佐賀県','九州'],['42','長崎県','九州'],['43','熊本県','九州'],['44','大分県','九州'],
      ['45','宮崎県','九州'],['46','鹿児島県','九州'],['47','沖縄県','九州'],
    ]
    for (const [code, name, region] of prefs) {
      await client.query(
        'INSERT INTO prefectures (code,name,region) VALUES ($1,$2,$3) ON CONFLICT (code) DO NOTHING',
        [code, name, region]
      )
    }
    console.log('  47 prefectures done')

    // users
    const adminHash  = await bcrypt.hash('admin1234',  10)
    const clinicHash = await bcrypt.hash('clinic1234', 10)
    const seekerHash = await bcrypt.hash('seeker1234', 10)

    const users = [
      { email: 'admin@bluejobs.jp',   password: adminHash,  name: '管理者',               role: 'admin',  pref: '東京都' },
      { email: 'clinic@bluejobs.jp',  password: clinicHash, name: 'スマイル歯科クリニック', role: 'clinic', pref: '東京都' },
      { email: 'clinic2@bluejobs.jp', password: clinicHash, name: 'さくら歯科医院',         role: 'clinic', pref: '大阪府' },
      { email: 'clinic3@bluejobs.jp', password: clinicHash, name: 'みなとみらい歯科',       role: 'clinic', pref: '神奈川県' },
      { email: 'seeker@bluejobs.jp',  password: seekerHash, name: '山田 花子',             role: 'seeker', pref: '東京都' },
      { email: 'seeker2@bluejobs.jp', password: seekerHash, name: '佐藤 健太',             role: 'seeker', pref: '大阪府' },
      { email: 'seeker3@bluejobs.jp', password: seekerHash, name: '鈴木 美咲',             role: 'seeker', pref: '神奈川県' },
    ]

    const userIds = {}
    for (const u of users) {
      const ex = await client.query('SELECT id FROM users WHERE email=$1', [u.email])
      let id
      if (ex.rows.length) {
        id = ex.rows[0].id
        await client.query(
          'UPDATE users SET password=$2,name=$3,role=$4,prefecture=$5 WHERE id=$1',
          [id, u.password, u.name, u.role, u.pref]
        )
      } else {
        const r = await client.query(
          "INSERT INTO users (name,email,password,role,prefecture,provider) VALUES ($1,$2,$3,$4,$5,'email') RETURNING id",
          [u.name, u.email, u.password, u.role, u.pref]
        )
        id = r.rows[0].id
      }
      userIds[u.email] = id
    }
    console.log('  7 users done')

    // clinics
    const clinicData = [
      { email: 'clinic@bluejobs.jp',  name: 'スマイル歯科クリニック', pref: '東京都',   city: '渋谷区',       addr: '渋谷1-2-3',        phone: '03-1234-5678', desc: '渋谷駅から徒歩3分。最新設備を備えた総合歯科クリニックです。' },
      { email: 'clinic2@bluejobs.jp', name: 'さくら歯科医院',         pref: '大阪府',   city: '大阪市北区',   addr: '梅田2-4-6',        phone: '06-1234-5678', desc: '梅田エリアの中心部。小児歯科から矯正まで幅広く対応しています。' },
      { email: 'clinic3@bluejobs.jp', name: 'みなとみらい歯科',       pref: '神奈川県', city: '横浜市西区',   addr: 'みなとみらい3-5-1', phone: '045-1234-5678', desc: 'みなとみらいの絶景を望む最新型歯科クリニック。' },
    ]
    const clinicIds = {}
    for (const c of clinicData) {
      const uid = userIds[c.email]
      const ex = await client.query('SELECT id FROM clinics WHERE userid=$1', [uid])
      let id
      if (ex.rows.length) {
        id = ex.rows[0].id
        await client.query(
          'UPDATE clinics SET clinicname=$2,prefecture=$3,city=$4,address=$5,phone=$6,status=$7,description=$8 WHERE id=$1',
          [id, c.name, c.pref, c.city, c.addr, c.phone, 'active', c.desc]
        )
      } else {
        const r = await client.query(
          "INSERT INTO clinics (clinicname,prefecture,city,address,phone,status,description,userid) VALUES ($1,$2,$3,$4,$5,'active',$6,$7) RETURNING id",
          [c.name, c.pref, c.city, c.addr, c.phone, c.desc, uid]
        )
        id = r.rows[0].id
      }
      clinicIds[c.email] = id
    }
    console.log('  3 clinics done')

    // jobs
    const jobsData = [
      { ce: 'clinic@bluejobs.jp',  title: '歯科衛生士（正社員）渋谷院',    jt: '歯科衛生士', et: '正社員',            pref: '東京都',   city: '渋谷区',     smin: 250000, smax: 350000,  st: '月給', vc: 312, ac: 8, ia: true,  desc: '渋谷の総合歯科クリニックで歯科衛生士を募集。' },
      { ce: 'clinic@bluejobs.jp',  title: '歯科医師（非常勤）週3日から',    jt: '歯科医師',   et: 'パート・アルバイト', pref: '東京都',   city: '渋谷区',     smin: 50000,  smax: 80000,   st: '時給', vc: 198, ac: 3, ia: true,  desc: '週3日から勤務可能。ベテラン・若手ともに歓迎。' },
      { ce: 'clinic@bluejobs.jp',  title: '受付・歯科助手（パート）',        jt: '受付・事務', et: 'パート・アルバイト', pref: '東京都',   city: '渋谷区',     smin: 1200,   smax: 1500,    st: '時給', vc: 88,  ac: 2, ia: true,  desc: '受付業務・患者対応をお任せします。未経験歓迎。' },
      { ce: 'clinic2@bluejobs.jp', title: '歯科衛生士（正社員）梅田院',     jt: '歯科衛生士', et: '正社員',            pref: '大阪府',   city: '大阪市北区', smin: 240000, smax: 330000,  st: '月給', vc: 254, ac: 6, ia: true,  desc: '梅田エリアの人気クリニック。チームワークを大切にしています。' },
      { ce: 'clinic2@bluejobs.jp', title: '歯科助手（正社員）経験者優遇',    jt: '歯科助手',   et: '正社員',            pref: '大阪府',   city: '大阪市北区', smin: 200000, smax: 270000,  st: '月給', vc: 176, ac: 4, ia: true,  desc: 'ドクターのサポート。経験者は給与優遇あり。' },
      { ce: 'clinic2@bluejobs.jp', title: '歯科技工士（正社員）CAD経験者',   jt: '歯科技工士', et: '正社員',            pref: '大阪府',   city: '大阪市北区', smin: 260000, smax: 380000,  st: '月給', vc: 142, ac: 2, ia: false, desc: '自社ラボでの技工業務。CAD/CAM経験者歓迎。' },
      { ce: 'clinic3@bluejobs.jp', title: '歯科衛生士（パート）週3日から',   jt: '歯科衛生士', et: 'パート・アルバイト', pref: '神奈川県', city: '横浜市西区', smin: 1600,   smax: 2000,    st: '時給', vc: 203, ac: 5, ia: true,  desc: 'みなとみらいで働けます。育児中の方も活躍中。' },
      { ce: 'clinic3@bluejobs.jp', title: '歯科医師（常勤）矯正経験者優遇', jt: '歯科医師',   et: '正社員',            pref: '神奈川県', city: '横浜市西区', smin: 600000, smax: 1200000, st: '月給', vc: 389, ac: 7, ia: true,  desc: '矯正歯科専門クリニック。インビザライン認定医歓迎。' },
    ]
    const jobIds = []
    for (const j of jobsData) {
      const cid = clinicIds[j.ce]
      const ex = await client.query(
        'SELECT id FROM jobs WHERE clinicid=$1 AND title=$2 AND deletedat IS NULL',
        [cid, j.title]
      )
      let id
      if (ex.rows.length) {
        id = ex.rows[0].id
      } else {
        const r = await client.query(
          'INSERT INTO jobs (title,jobtype,employmenttype,prefecture,city,salarymin,salarymax,salarytype,description,isactive,viewcount,applicationcount,clinicid) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id',
          [j.title, j.jt, j.et, j.pref, j.city, j.smin, j.smax, j.st, j.desc, j.ia, j.vc, j.ac, cid]
        )
        id = r.rows[0].id
      }
      jobIds.push(id)
    }
    console.log('  ' + jobsData.length + ' jobs done')

    // applications
    const appsData = [
      { se: 'seeker@bluejobs.jp',  ji: 0, status: 'reviewing', msg: '歯科衛生士として5年の経験があります。' },
      { se: 'seeker2@bluejobs.jp', ji: 0, status: 'interview', msg: '御院の予防歯科への取り組みに共感しています。' },
      { se: 'seeker3@bluejobs.jp', ji: 3, status: 'applied',   msg: '大阪への転居予定です。' },
      { se: 'seeker@bluejobs.jp',  ji: 1, status: 'applied',   msg: '週3日から勤務できます。' },
      { se: 'seeker2@bluejobs.jp', ji: 6, status: 'reviewing', msg: '育児とも両立できる環境を探しています。' },
      { se: 'seeker3@bluejobs.jp', ji: 7, status: 'interview', msg: 'インビザライン認定医です。ご検討ください。' },
      { se: 'seeker@bluejobs.jp',  ji: 4, status: 'offered',   msg: '矯正助手の経験があります。' },
      { se: 'seeker2@bluejobs.jp', ji: 2, status: 'applied',   msg: '受付業務の経験があります。' },
    ]
    let appCount = 0
    for (const a of appsData) {
      const sid = userIds[a.se]
      const jid = jobIds[a.ji]
      if (!sid || !jid) continue
      const ex = await client.query(
        'SELECT id FROM applications WHERE seekerid=$1 AND jobid=$2',
        [sid, jid]
      )
      if (!ex.rows.length) {
        await client.query(
          'INSERT INTO applications (seekerid,jobid,status,message) VALUES ($1,$2,$3,$4)',
          [sid, jid, a.status, a.msg]
        )
        appCount++
      }
    }
    console.log('  ' + appCount + ' applications done')

    await client.query('COMMIT')
    console.log('Seed completed successfully!')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Seed failed:', err.message)
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch(() => process.exit(1))
