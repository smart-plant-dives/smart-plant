insert ignore into tb_usuario (id_usuario, login, nome_usuario, senha, tipo_usuario) values 
(1, "isaminhao", "isabellaminhao@gmail.com", "Bell@123", "ADMINISTRADOR"); 

insert ignore into tb_usuario (id_usuario, login, nome_usuario, senha, tipo_usuario) values 
(2, "maribenini", "mariabenini@gmail.com", "Morg@123", "USUARIO"); 

insert ignore into tb_usuario (id_usuario, login, nome_usuario, senha, tipo_usuario) values 
(3, "laufontes", "laurafontes@gmail.com", "Laur@321", "USUARIO"); 

insert ignore into tb_usuario (id_usuario, login, nome_usuario, senha, tipo_usuario) values 
(4, "luanacosta", "luanacosta@gmail.com", "L#@n4012", "USUARIO"); 

insert ignore into tb_usuario (id_usuario, login, nome_usuario, senha, tipo_usuario) values 
(5, "leticiagomes", "leticiagomes@gmail.com", "G0m3s989", "USUARIO"); 

insert ignore into tb_categoria (id, nome_categoria) values
(1, "Ornamental");

insert ignore into tb_categoria (id, nome_categoria) values
(2, "Frutífera");

insert ignore into tb_categoria (id, nome_categoria) values
(3, "Medicinal");

insert ignore into tb_categoria (id, nome_categoria) values
(4, "Alimenticia");


insert ignore into tb_planta (id_planta, especie, nome_planta, url, nome_categoria, id_usuario) values
(1, "Lilium Candidum","Bebezinha","https://dicasdeplantas.com.br/wp-content/uploads/2024/02/lirio-branco02.jpg", 1, 1);

insert ignore into tb_planta (id_planta, especie, nome_planta, url, nome_categoria, id_usuario) values
(2, " Helianthus annus","Girassol","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0G9kWxUi9ZAYLw16MVdjY9y_-xaO4bqdg7LPGp2oo3sqRZ0we", 1, 2);

insert ignore into tb_planta (id_planta, especie, nome_planta, url, nome_categoria, id_usuario) values
(3, "Amora-preta/comum ","Amor","https://receitatodahora.com.br/wp-content/uploads/2023/10/como-plantar-amora-no-vaso-29-091.jpg", 2, 3);

insert ignore into tb_planta (id_planta, especie, nome_planta, url, nome_categoria, id_usuario) values
(4, "Rosa chinensis","Rosinha","https://i.ytimg.com/vi/yG9BntxANY4/hqdefault.jpg?v=65aa7ffc", 1, 3);

insert ignore into tb_planta (id_planta, especie, nome_planta, url, nome_categoria, id_usuario) values
(5, "Espada-de-São-Jorge","Espada","https://cdn.awsli.com.br/496/496853/produto/45946185/390a4b98c7.jpg",1, 4);

insert ignore into tb_planta (id_planta, especie, nome_planta, url, nome_categoria, id_usuario) values
(6, "Diversas espécies ","Jardim Colorido","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0G9kWxUi9ZAYLw16MVdjY9y_-xaO4bqdg7LPGp2oo3sqRZ0we", 1 ,4);

insert ignore into tb_planta (id_planta, especie, nome_planta, url, nome_categoria, id_usuario) values
(7, "Nephrolepis exaltata ","Samambaia","https://www.giromarilia.com.br/wp-content/uploads/2025/11/Samambaia-o-ingrediente-caseiro-que-devolve-o-verde-intenso-em-poucos-dias-1280x720-1.webp", 1, 5);

insert ignore into tb_planta (id_planta, especie, nome_planta, url, nome_categoria, id_usuario) values
(8, "Leucanthemum vulgare ","Margaridas","https://http2.mlstatic.com/D_NQ_NP_890197-MLU78675800175_082024-O.webp", 1,5);

	
	

