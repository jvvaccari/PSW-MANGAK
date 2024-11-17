import fs from 'fs';

const mangas = [
    {
        id: 1,
        title: "Jujutsu Kaisen",
        image: "https://upload.wikimedia.org/wikipedia/pt/4/4b/Jujutsu_Kaisen_Cover.png",
        author: "Gege Akutami",
        description: "Yuji Itadori, um adolescente, entra no mundo da feitiçaria.",
        yearPubli: "2021",
        status: "EM ANDAMENTO",
        demographic: "Shonen",
        genres: ["Ação", "Sobrenatural", "Terror"],
        saved: 0,
        artsList: [
            "https://criticalhits.com.br/wp-content/uploads/2021/04/jujutsu-kaisen-wallpaper-smartphone-09.jpg",
            "https://wallpapers.com/images/hd/itadori-hand-jujutsu-kaisen-iphone-483xqcsa46culk5s.jpg",
            "https://i.pinimg.com/736x/fa/8b/5a/fa8b5ae4ac6f2398b4e0cccdfcf80983.jpg",
            "https://wallpapers.com/images/hd/sleeping-itadori-and-sukuna-reflection-jujutsu-kaisen-phone-iq0fzvcstqnjguj6.jpg",
            "https://wallpaper4k.top/wp-content/uploads/2024/02/Fundo-de-Tela-Jujutsu-Kaisen-4k-para-Celular-Samsung-473x1024.jpg",
            "https://wallpapers.com/images/hd/sukuna-markings-yuji-itadori-jujutsu-kaisen-phone-jcnto771g11t36s8.jpg",
            "https://pbs.twimg.com/media/E12nRHkXIAMjmRO?format=jpg&name=large",
            "https://wallpapers.com/images/hd/minimalist-yuji-itadori-fanart-jujutsu-kaisen-phone-04anu0a01q2hjzoh.jpg",
            "https://wallpaper4k.top/wp-content/uploads/2024/02/Papel-de-Parede-4k-Jujutsu-Kaisen-Smartphone-473x1024.jpg",
        ],
        retail: [
            { name: "Panini", url: "https://panini.com.br/planet-manga/chainsaw-man?srsltid=AfmBOoqcmp8IaVIywAKBhhJHNeoSFZeSc23kv4xnwBD90i6orwX_zf-7" },
            { name: "Amazon", url: "https://www.amazon.com.br/Chainsaw-Man-Vol-Tatsuki-Fujimoto/dp/6555127333" },
            { name: "Mercado Livre", url: "https://lista.mercadolivre.com.br/manga-chainsaw-man" },
            { name: "Shopee", url: "https://shopee.com.br/list/Mang%C3%A1/Chainsaw%20Man?srsltid=AfmBOoqUZsc9IQ0q2BXI7fEmOIYvgXpjw-8gsY863RaLN_1hp_jBZOcO" },
        ],
    },
    {
        id: 2,
        title: "One Piece",
        image: "https://upload.wikimedia.org/wikipedia/pt/f/ff/One_Piece_vol._01.jpg",
        author: "Eiichiro Oda",
        description: "As aventuras de Monkey D. Luffy para encontrar o tesouro One Piece.",
        yearPubli: "2021",
        status: "Em andamento",
        demographic: "Shonen",
        genres: ["Aventura", "Comédia", "Fantasia"],
        saved: 0,
        artsList: [
            "https://wallpapers.com/images/hd/one-piece-luffy-gear-5-portrait-4k-uwwl7iz0hx6wbjvk.jpg",
            "https://wallpapers.com/images/hd/monkey-d-luffy-ace-sabo-one-piece-4k-stmn8dqcz5yux2nx.jpg"
        ],
        retail: [
            { name: "Panini", url: "https://panini.com.br/planet-manga/chainsaw-man?srsltid=AfmBOoqcmp8IaVIywAKBhhJHNeoSFZeSc23kv4xnwBD90i6orwX_zf-7" },
            { name: "Amazon", url: "https://www.amazon.com.br/Chainsaw-Man-Vol-Tatsuki-Fujimoto/dp/6555127333" },
            { name: "Mercado Livre", url: "https://lista.mercadolivre.com.br/manga-chainsaw-man" },
            { name: "Shopee", url: "https://shopee.com.br/list/Mang%C3%A1/Chainsaw%20Man?srsltid=AfmBOoqUZsc9IQ0q2BXI7fEmOIYvgXpjw-8gsY863RaLN_1hp_jBZOcO" },
        ]
    },
    {
        id: 3,
        title: "Kaguya-sama: Love is War",
        image: "https://upload.wikimedia.org/wikipedia/pt/5/5a/Capa_do_d%C3%A9cimo_volume_do_mang%C3%A1_Kaguya-sama.jpg",
        author: "Aka Akasaka",
        description: "Dois gênios apaixonados competem para fazer o outro confessar primeiro.",
        yearPubli: "2021",
        status: "FINALIZADO",
        demographic: "Seinen",
        genres: ["Romance", "Comédia", "Psicológico"],
        saved: 0,
        artsList: [
            "https://wallpapers.com/images/hd/kaguya-sama-love-is-war-character-poster-r6ydgixrhrpy9c7z.jpg"
        ],
        retail: [
            { name: "Panini", url: "https://panini.com.br/planet-manga/chainsaw-man?srsltid=AfmBOoqcmp8IaVIywAKBhhJHNeoSFZeSc23kv4xnwBD90i6orwX_zf-7" },
            { name: "Amazon", url: "https://www.amazon.com.br/Chainsaw-Man-Vol-Tatsuki-Fujimoto/dp/6555127333" },
            { name: "Mercado Livre", url: "https://lista.mercadolivre.com.br/manga-chainsaw-man" },
            { name: "Shopee", url: "https://shopee.com.br/list/Mang%C3%A1/Chainsaw%20Man?srsltid=AfmBOoqUZsc9IQ0q2BXI7fEmOIYvgXpjw-8gsY863RaLN_1hp_jBZOcO" },
        ]
    },
    {
        id: 4,
        title: "Attack on Titan",
        image: "https://upload.wikimedia.org/wikipedia/pt/e/e7/SnK_Volume1.png",
        author: "Hajime Isayama",
        description: "Humanos enfrentam gigantes devoradores em um mundo pós-apocalíptico.",
        yearPubli: "2021",
        status: "FINALIZADO",
        demographic: "Shonen",
        genres: ["Ação", "Drama", "Sobrenatural"],
        saved: 0,
        artsList: [
            "https://wallpapers.com/images/hd/attack-on-titan-eren-jaeger-destruction-7k-uhwoq4qx9he9zkgj.jpg"
        ],
        retail: [
            { name: "Panini", url: "https://panini.com.br/planet-manga/chainsaw-man?srsltid=AfmBOoqcmp8IaVIywAKBhhJHNeoSFZeSc23kv4xnwBD90i6orwX_zf-7" },
            { name: "Amazon", url: "https://www.amazon.com.br/Chainsaw-Man-Vol-Tatsuki-Fujimoto/dp/6555127333" },
            { name: "Mercado Livre", url: "https://lista.mercadolivre.com.br/manga-chainsaw-man" },
            { name: "Shopee", url: "https://shopee.com.br/list/Mang%C3%A1/Chainsaw%20Man?srsltid=AfmBOoqUZsc9IQ0q2BXI7fEmOIYvgXpjw-8gsY863RaLN_1hp_jBZOcO" },
        ]
    },
    {
        id: 5,
        title: "My Hero Academia",
        image: "https://upload.wikimedia.org/wikipedia/pt/5/5a/Boku_no_Hero_Academia_Volume_1.png",
        author: "Kohei Horikoshi",
        description: "Izuku Midoriya tenta se tornar o maior herói do mundo.",
        yearPubli: "2021",
        status: "Em andamento",
        demographic: "Shonen",
        genres: ["Ação", "Aventura", "Fantasia"],
        saved: 0,
        artsList: [
            "https://wallpapers.com/images/hd/izuku-midoriya-hero-academia-portrait-4k-2ir5sy3aygimrrwf.jpg",
            "https://wallpapers.com/images/hd/hero-academia-all-might-and-izuku-y5ue6dw4gx8rcoow.jpg"
        ],
        retail: [
            { name: "Panini", url: "https://panini.com.br/planet-manga/chainsaw-man?srsltid=AfmBOoqcmp8IaVIywAKBhhJHNeoSFZeSc23kv4xnwBD90i6orwX_zf-7" },
            { name: "Amazon", url: "https://www.amazon.com.br/Chainsaw-Man-Vol-Tatsuki-Fujimoto/dp/6555127333" },
            { name: "Mercado Livre", url: "https://lista.mercadolivre.com.br/manga-chainsaw-man" },
            { name: "Shopee", url: "https://shopee.com.br/list/Mang%C3%A1/Chainsaw%20Man?srsltid=AfmBOoqUZsc9IQ0q2BXI7fEmOIYvgXpjw-8gsY863RaLN_1hp_jBZOcO" },
        ]
    },
    {
        id: 6,
        title: "Death Note",
        image: "https://upload.wikimedia.org/wikipedia/pt/c/c0/Death_Note_vol._01.jpg",
        author: "Tsugumi Ohba",
        description: "Um estudante encontra um caderno que permite matar qualquer pessoa.",
        yearPubli: "2021",
        status: "FINALIZADO",
        demographic: "Shonen",
        genres: ["Mistério", "Suspense", "Psicológico"],
        saved: 0,
        artsList: [
            "https://wallpapers.com/images/hd/death-note-light-yagami-and-ryuk-4k-hy2iy8dmnkzckk6y.jpg",
            "https://wallpapers.com/images/hd/death-note-l-character-poster-4k-qjszvqlmhgmxgpvg.jpg"
        ],
        retail: [
            { name: "Panini", url: "https://panini.com.br/planet-manga/chainsaw-man?srsltid=AfmBOoqcmp8IaVIywAKBhhJHNeoSFZeSc23kv4xnwBD90i6orwX_zf-7" },
            { name: "Amazon", url: "https://www.amazon.com.br/Chainsaw-Man-Vol-Tatsuki-Fujimoto/dp/6555127333" },
            { name: "Mercado Livre", url: "https://lista.mercadolivre.com.br/manga-chainsaw-man" },
            { name: "Shopee", url: "https://shopee.com.br/list/Mang%C3%A1/Chainsaw%20Man?srsltid=AfmBOoqUZsc9IQ0q2BXI7fEmOIYvgXpjw-8gsY863RaLN_1hp_jBZOcO" },
        ]
    },
    {
        id: 7,
        title: "Tokyo Ghoul",
        image: "https://upload.wikimedia.org/wikipedia/pt/6/65/Tokyo_Ghoul_volume_1.jpg",
        author: "Sui Ishida",
        description: "Ken Kaneki vira meio-ghoul após um encontro mortal.",
        yearPubli: "2021",
        status: "FINALIZADO",
        demographic: "Seinen",
        genres: ["Horror", "Sobrenatural", "Drama"],
        saved: 0,
        artsList: [
            "https://wallpapers.com/images/hd/kaneki-ken-tokyo-ghoul-wallpaper-jvfaeclfqai15z4a.jpg",
            "https://wallpapers.com/images/hd/tokyo-ghoul-kaneki-mask-wq24yql8lqrszdqz.jpg"
        ],
        retail: [
            { name: "Panini", url: "https://panini.com.br/planet-manga/chainsaw-man?srsltid=AfmBOoqcmp8IaVIywAKBhhJHNeoSFZeSc23kv4xnwBD90i6orwX_zf-7" },
            { name: "Amazon", url: "https://www.amazon.com.br/Chainsaw-Man-Vol-Tatsuki-Fujimoto/dp/6555127333" },
            { name: "Mercado Livre", url: "https://lista.mercadolivre.com.br/manga-chainsaw-man" },
            { name: "Shopee", url: "https://shopee.com.br/list/Mang%C3%A1/Chainsaw%20Man?srsltid=AfmBOoqUZsc9IQ0q2BXI7fEmOIYvgXpjw-8gsY863RaLN_1hp_jBZOcO" },
        ]
    },
    {
        id: 8,
        title: "Naruto",
        image: "https://upload.wikimedia.org/wikipedia/pt/d/d2/Naruto_vol._01.jpg",
        author: "Masashi Kishimoto",
        description: "Naruto Uzumaki, um jovem ninja, busca reconhecimento e se tornar Hokage.",
        yearPubli: "2021",
        status: "FINALIZADO",
        demographic: "Shonen",
        genres: ["Ação", "Aventura", "Fantasia"],
        saved: 0,
        artsList: [
            "https://wallpapers.com/images/hd/naruto-uzumaki-ninja-hokage-4k-bocgxw5uv7rwo3kq.jpg",
            "https://wallpapers.com/images/hd/sasuke-uchiha-naruto-wallpaper-m2y3puaxowrrrtfq.jpg"
        ],
        retail: [
            { name: "Panini", url: "https://panini.com.br/planet-manga/chainsaw-man?srsltid=AfmBOoqcmp8IaVIywAKBhhJHNeoSFZeSc23kv4xnwBD90i6orwX_zf-7" },
            { name: "Amazon", url: "https://www.amazon.com.br/Chainsaw-Man-Vol-Tatsuki-Fujimoto/dp/6555127333" },
            { name: "Mercado Livre", url: "https://lista.mercadolivre.com.br/manga-chainsaw-man" },
            { name: "Shopee", url: "https://shopee.com.br/list/Mang%C3%A1/Chainsaw%20Man?srsltid=AfmBOoqUZsc9IQ0q2BXI7fEmOIYvgXpjw-8gsY863RaLN_1hp_jBZOcO" },
        ]
    },
    {
        id: 9,
        title: "Bleach",
        image: "https://upload.wikimedia.org/wikipedia/pt/4/45/Bleach_vol._01.jpg",
        author: "Tite Kubo",
        description: "Ichigo Kurosaki ganha poderes de shinigami e protege os vivos dos Hollows.",
        yearPubli: "2021",
        status: "FINALIZADO",
        demographic: "Shonen",
        genres: ["Ação", "Sobrenatural", "Aventura"],
        saved: 0,
        artsList: [
            "https://wallpapers.com/images/hd/ichigo-kurosaki-bleach-fighting-form-dcqbd2kg5r0mm7v6.jpg",
            "https://wallpapers.com/images/hd/rukia-kuchiki-bleach-fan-art-t9b6kdhu9uvs2fpo.jpg"
        ],
        retail: [
            { name: "Panini", url: "https://panini.com.br/planet-manga/chainsaw-man?srsltid=AfmBOoqcmp8IaVIywAKBhhJHNeoSFZeSc23kv4xnwBD90i6orwX_zf-7" },
            { name: "Amazon", url: "https://www.amazon.com.br/Chainsaw-Man-Vol-Tatsuki-Fujimoto/dp/6555127333" },
            { name: "Mercado Livre", url: "https://lista.mercadolivre.com.br/manga-chainsaw-man" },
            { name: "Shopee", url: "https://shopee.com.br/list/Mang%C3%A1/Chainsaw%20Man?srsltid=AfmBOoqUZsc9IQ0q2BXI7fEmOIYvgXpjw-8gsY863RaLN_1hp_jBZOcO" },
        ]
    },
    {
        id: 10,
        title: "Hunter x Hunter",
        image: "https://upload.wikimedia.org/wikipedia/pt/6/63/Hunter_x_Hunter_Volume_1.JPG",
        author: "Yoshihiro Togashi",
        description: "Gon Freecss embarca em uma jornada para se tornar um Hunter e encontrar seu pai.",
        yearPubli: "2021",
        status: "Em Hiato",
        demographic: "Shonen",
        genres: ["Aventura", "Ação", "Fantasia"],
        saved: 0,
        artsList: [
            "https://wallpapers.com/images/hd/gon-freecss-hunter-x-hunter-4k-portrait-2uy25gjad6suq3r1.jpg",
            "https://wallpapers.com/images/hd/killua-zoldyck-hunter-x-hunter-xydtvs9gvpbw02ep.jpg"
        ],
        retail: [
            { name: "Panini", url: "https://panini.com.br/planet-manga/chainsaw-man?srsltid=AfmBOoqcmp8IaVIywAKBhhJHNeoSFZeSc23kv4xnwBD90i6orwX_zf-7" },
            { name: "Amazon", url: "https://www.amazon.com.br/Chainsaw-Man-Vol-Tatsuki-Fujimoto/dp/6555127333" },
            { name: "Mercado Livre", url: "https://lista.mercadolivre.com.br/manga-chainsaw-man" },
            { name: "Shopee", url: "https://shopee.com.br/list/Mang%C3%A1/Chainsaw%20Man?srsltid=AfmBOoqUZsc9IQ0q2BXI7fEmOIYvgXpjw-8gsY863RaLN_1hp_jBZOcO" },
        ]
    }
]

const jsonData = JSON.stringify(mangas,null,2);
const filePath = './db.json';
const writeStream = fs.createWriteStream(filePath);

try{
    writeStream.write(jsonData);
    console.log('O arquivo JSON foi salvo com sucesso!')
    writeStream.end();
}catch(err){
    console.log('Erro ao salvar o arquivo JSON',err);
}