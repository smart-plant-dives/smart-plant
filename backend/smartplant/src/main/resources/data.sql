INSERT INTO tb_usuario
(id_usuario, email, login, nome_usuario, senha, tipo_usuario)
VALUES
(1, 'isabellaminhao@gmail.com', 'isaminhao', 'Isabella Minhão', 'Bell@123', 'ADMINISTRADOR'),
(2, 'mariabenini@gmail.com', 'maribenini', 'Maria Benini', 'Morg@123', 'USUARIO'),
(3, 'laurafontes@gmail.com', 'laufontes', 'Laura Fontes', 'Laur@321', 'USUARIO'),
(4, 'luanacosta@gmail.com', 'luanacosta', 'Luana Costa', 'L#@n4012', 'USUARIO'),
(5, 'leticiagomes@gmail.com', 'leticiagomes', 'Letícia Gomes', 'G0m3s989', 'USUARIO')
ON DUPLICATE KEY UPDATE
email = VALUES(email),
login = VALUES(login),
nome_usuario = VALUES(nome_usuario),
senha = VALUES(senha),
tipo_usuario = VALUES(tipo_usuario);


-- =========================================
-- CATEGORIAS
-- =========================================

INSERT INTO tb_categoria (id, nome_categoria)
VALUES
(1, 'Ornamental'),
(2, 'Frutífera'),
(3, 'Medicinal'),
(4, 'Alimentícia')
ON DUPLICATE KEY UPDATE
nome_categoria = VALUES(nome_categoria);


-- =========================================
-- PLANTAS
-- =========================================

INSERT INTO tb_planta
(id_planta, especie, nome_planta, url, nome_categoria, id_usuario, descricao)
VALUES
(
    1,
    'Lilium Candidum',
    'Bebezinha',
    'https://dicasdeplantas.com.br/wp-content/uploads/2024/02/lirio-branco02.jpg',
    1,
    1,
    'Eu gosto muito dessa planta, minha mãe me ensinou a plantar ela desde criança'
),
(
    2,
    'Helianthus annuus',
    'Girassol',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0G9kWxUi9ZAYLw16MVdjY9y_-xaO4bqdg7LPGp2oo3sqRZ0we',
    1,
    2,
    'É um pouco complicado de cuidar, mas eu amo elas completamente.'
),
(
    3,
    'Amora-preta/comum',
    'Amor',
    'https://receitatodahora.com.br/wp-content/uploads/2023/10/como-plantar-amora-no-vaso-29-091.jpg',
    2,
    3,
    'Ela é tudo!!! Serio, recomendo muito.'
),
(
    4,
    'Rosa chinensis',
    'Rosinha',
    'https://i.ytimg.com/vi/yG9BntxANY4/hqdefault.jpg?v=65aa7ffc',
    1,
    3,
    'A melhor para cuidar.'
),
(
    5,
    'Espada-de-São-Jorge',
    'Espada',
    'https://cdn.awsli.com.br/496/496853/produto/45946185/390a4b98c7.jpg',
    1,
    4,
    'Super pratica de cuidar.'
),
(
    6,
    'Diversas espécies',
    'Jardim Colorido',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0G9kWxUi9ZAYLw16MVdjY9y_-xaO4bqdg7LPGp2oo3sqRZ0we',
    1,
    4,
    'Fica muito lindooo'
),
(
    7,
    'Nephrolepis exaltata',
    'Samambaia',
    'https://www.giromarilia.com.br/wp-content/uploads/2025/11/Samambaia-o-ingrediente-caseiro-que-devolve-o-verde-intenso-em-poucos-dias-1280x720-1.webp',
    1,
    5,
    'Ela é tao fofa e facil de cuidar, da um avibe super clean.'
),
(
    8,
    'Leucanthemum vulgare',
    'Margaridas',
    'https://http2.mlstatic.com/D_NQ_NP_890197-MLU78675800175_082024-O.webp',
    1,
    5,
    'São incriveis, se você procura uma planta para cuidar essa é a ideal.'
)
ON DUPLICATE KEY UPDATE
especie = VALUES(especie),
nome_planta = VALUES(nome_planta),
url = VALUES(url),
nome_categoria = VALUES(nome_categoria),
id_usuario = VALUES(id_usuario),
descricao = VALUES(descricao);
