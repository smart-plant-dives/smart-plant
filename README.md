# Smart Plant 

![Java](https://img.shields.io/badge/javafx-%23FF0000.svg?style=for-the-badge&logo=javafx&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-%23DD3A0A.svg?style=for-the-badge&logo=postcss&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)

## Sobre o projeto
Este **Projeto Smart Plant** é uma aplicação fullstack desenvolvida como um projeto de TCC (trabalho de conclusão de curso) no curso de desenvolvimento de sistemas, oferecido pelo SENAI Sorocaba - Gaspar Ricardo Júnior, ministrado pelo Prof. [Vedilson Prado](https://github.com/vedilsonprado) e pela prof. [Luciana Sayuri Fugita](). O projeto Smart Plant tem como objetivo monitorar o cuidado de plantas domésticas, oferecendo segurança 24 horas por dia, com administração de rega e orientações sobre luz e nutrientes. Nosso público alvo são pessoas que tem ou gostariam de possuir plantas, porém não conseguem acompanhar os cuidados necessários devido a rotina, além de não encontrarem as informações corretas; isso compromete a vida e como consequência, à perda da planta. Para atender as necessidades dos nossos usuários, o sistema criado tem como função controlar a umidade do solo em tempo real por meio de um sensor IoT que será conectado em nosso aplicativo. Ele irá identificar a falta de água e acionar uma bomba automaticamente, liberando a quantidade ideal (variando para cada espécie). Em nosso site e aplicativo terá disponibilizado informações verídicas de cada espécie, auxiliando e tornando prático na hora de adquirir uma nova planta. O projeto tem como intuito de consolidar os conhecimentos na criação de API RestFull, manipulação do Banco de Dados Relacional e integração com o frontend usando JavaScript.

A aplicação permite o gerenciamento completo (CRUD) de plantas, incluindo validação de regras de negócio e persistência de dados. 

---

## Tecnologias utilizadas

### Backend
- **Java 17** Principal linguagem.
    - **Spring Boot:** Framework para a criação de api

### Banco de Dados
- **MySQL:** Banco de Dados Relacional.

### Frontend
- **HTML5 & CSS3:** Estrutura semântica e estilização
- **JavaScript:** Lógica do cliente e consumo da APi.

## Como executar o projeto

### 1. Banco de Dados
- Crie o banco de dados MySQL executando o script SQL: 
```sql
CREATE DATABASE db_api;
```

### 2. Backend
- Clonar repositório.
- Configure o arquivo application.properties com as suas credenciais do MySQL.
- A API rodará em: `hhtp://localhost:8080`

### 3. Frontend
- Navegue até a pasta do Frontend.
- Acesse o index.html no navegador.

## Funcionalidades 
[x] Cadastrar Planta
[x] Listar Planta
[x] Editar Planta
[x] Excluir Planta

---

<p style="color; red;">Desenvolvedores</p>
[Maria Heloísa Benini Marques](https://www.linkedin.com/in/maria-heloisa-benini-marques-639b34378/)
[Isabella Alexandre Minhão](www.linkedin.com/in/isabella-alexandre-minhao-648ba6368)
[Laura Carolino Fontes]()
[Letícia do Nascimento Gomes]()
[Luana Emily Santos Costa]()
[Stephanie Mariana de Camargo Favero](https://br.linkedin.com/in/stephanie-mariana-de-camargo-favero-441036369?trk=people-guest_people_search-card)
