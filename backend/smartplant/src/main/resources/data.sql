-- -------------------------
-- USUÁRIOS
-- -------------------------
INSERT INTO tb_usuario(id_usuario, nome_usuario, login, email, senha, foto_perfil, tipo_usuario)VALUES
(1, 'Isabella Minhão', 'isaminhao', 'isabellaminhao@gmail.com', 'B3ll4is@', 'https://i.pinimg.com/736x/ee/52/1e/ee521e2f8d8095eba0d9c04a3c436eec.jpg', 'ADMINISTRADOR'),
(2, 'Maria Benini', 'maribenini', 'mariabenini@gmail.com', 'Morg@123', 'https://i.pinimg.com/736x/4d/22/bd/4d22bd5f55470cac526dffdf48b59c7f.jpg', 'USUARIO'),
(3, 'Laura Fontes', 'laufontes', 'laurafontes@gmail.com', 'Lau#1234', 'https://i.pinimg.com/736x/7c/db/8d/7cdb8dd2b4eddb0155661875a996a15c.jpg',  'USUARIO'),
(4, 'Luana Costa', 'luanacosta', 'luanacosta@gmail.com', 'Lu@n4321', 'https://i.pinimg.com/736x/ac/0d/0b/ac0d0b28d86f1b703f8fc7b95df49dc9.jpg', 'USUARIO'),
(5, 'Letícia Gomes', 'leticiagomes', 'leticiagomes@gmail.com', 'G@m3s123', 'https://i.pinimg.com/736x/a8/cf/11/a8cf11b19d30ada3f35c0535aa420853.jpg', 'USUARIO'),
(6, 'Stephanie Favero', 'stefavero', 'stephanie.favero@gmail.com', 'Ste@1234', 'https://i.pinimg.com/736x/d8/05/09/d805096ae136f6ce3f8653096acc0f8c.jpg', 'USUARIO')
ON DUPLICATE KEY UPDATE
nome_usuario = VALUES(nome_usuario),
login = VALUES(login),
email = VALUES(email),
senha = VALUES(senha),
foto_perfil = VALUES(foto_perfil),
tipo_usuario = VALUES(tipo_usuario);

-- -------------------------
-- ESPÉCIES
-- -------------------------
INSERT INTO tb_categoria (id, nome_especie)VALUES
(1, 'Lilium Candidum'),
(2, 'Helianthus annuus'),
(3, 'Amora-preta/comum'),
(4, 'Rosa chinensis'),
(5, 'Espada-de-São-Jorge'),
(6, 'Diversas espécies'),
(7, 'Nephrolepis exaltata'),
(8, 'Leucanthemum vulgare')
ON DUPLICATE KEY UPDATE
nome_especie = VALUES(nome_especie);

-- -------------------------
-- PLANTAS
-- -------------------------
INSERT INTO tb_planta(id_planta, nome_planta, url, descricao, nome_especie, id_usuario)VALUES
(1, 'Bebezinha', 'https://dicasdeplantas.com.br/wp-content/uploads/2024/02/lirio-branco02.jpg','Eu gosto muito dessa planta, minha mãe me ensinou a plantar ela desde criança',1, 2),
(2, 'Girassol','https://i.pinimg.com/736x/a5/c9/f5/a5c9f51e1d4b111b2dc7d20d9520192c.jpg','É um pouco complicado de cuidar, mas eu amo elas completamente.',2, 1),
(3, 'Amor', 'https://receitatodahora.com.br/wp-content/uploads/2023/10/como-plantar-amora-no-vaso-29-091.jpg','Ela é tudo!!! Serio, recomendo muito.',3, 3),
(4, 'Rosinha','https://i.ytimg.com/vi/yG9BntxANY4/hqdefault.jpg?v=65aa7ffc','A melhor para cuidar.',4, 3),
(5, 'Espada','https://cdn.awsli.com.br/496/496853/produto/45946185/390a4b98c7.jpg','Super pratica de cuidar.',5, 4),
(6, 'Jardim Colorido','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0G9kWxUi9ZAYLw16MVdjY9y_-xaO4bqdg7LPGp2oo3sqRZ0we','Fica muito lindooo',6, 4),
(7, 'Samambaia','https://www.giromarilia.com.br/wp-content/uploads/2025/11/Samambaia-o-ingrediente-caseiro-que-devolve-o-verde-intenso-em-poucos-dias-1280x720-1.webp','Ela é tao fofa e facil de cuidar, da um avibe super clean.',7, 5),
(8, 'Margaridas','https://http2.mlstatic.com/D_NQ_NP_890197-MLU78675800175_082024-O.webp','São incriveis, se você procura uma planta para cuidar essa é a ideal.',8, 6)
ON DUPLICATE KEY UPDATE
nome_planta = VALUES(nome_planta),
url = VALUES(url),
descricao = VALUES(descricao),
nome_especie = VALUES(nome_especie),
id_usuario = VALUES(id_usuario);