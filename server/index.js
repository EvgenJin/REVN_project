const http = require('http');
const socketIO = require('socket.io');
const r = require('rethinkdb');
const config = require('./config.json');

const db = Object.assign(config.rethinkdb, {  
    db: 'timeline'
});
// const server = http.Server(app);  
const server = http.createServer(function(request, response){});
const io = socketIO(server);

r.connect(db)  
    .then(conn => {
        // обновления
        // r.table('messages')
        //     .changes()
        //     .run(conn)
        //     .then(cursor => {
        //         cursor.each((err, data) => {
        //             const message = data.new_val;
        //             io.sockets.emit('messages', message);
        //         });
        //     });
        //     r.db('timeline').table("messages")
        //     .filter(function(post) {
        //       return 
        //         post("date").ge('2017-11-13T00:00:00.000Z')
        //         .and
        //         (post("date").le('2018-12-01T00:00:00.000Z'));
        //   })
        // показать все записи
        io.on('connection', (client) => {
            r.table('messages')
                .run(conn)
                .then(cursor => {
                    cursor.each((err, message) => {
                        io.sockets.emit('messages', message);
                    });
                });
            // добавить запись
            client.on('messages', (body) => {
                const {
                    name, message, date
                } = body;
                const data = {
                    name, message, date
                    // : new Date()
                };
                r.table('messages').insert(data).run(conn);
            });

            client.on('test', (body) => {
                const {
                    date1,date2
                } = body;
                const req = {
                    date1,date2
                };
                console.log(date1 + "-----" + date2)
            //     io.sockets.emit('test',
            //     [{date: "2018-03-26T00:00:00.000Z"
            //     , id: "5688f830-7db3-40c6-bbc6-3cad08fa33c0"
            //     , message: "1"
            //     , name: "foo"},
            //     {date: "2018-03-27T00:00:00.000Z"
            //     , id: "5688f830-7db3-40c6-bbc6-3cad08fa33c0"
            //     , message: "2"
            //     , name: "bar"}]                
            // )
                r.table('messages')
                // .filter(
                // r.row('date').ge(date1)
                // .and(r.row('date').le(date2)))
                .run(conn)
                // .then(cursor => {
                    // cursor.each((err, message) => {
                //         io.sockets.emit('test', message);
                //         console.log(message)
                //     });
                // });
                .then(cursor => {
                    cursor.toArray((err,message) => {
                        io.sockets.emit('test',message)
                    })
                })
            });
            // client.on('querry',(body) => {
            //     const {
            //         date1, date2
            //     } = body;
            //     r.table('messages')
            //     .filter(
            //         r.row('date').ge(date1)
            //         .and(r.row('date').le(date2)))
            //             .run(conn)
            //                 .then(cursor => {
            //                     cursor.each((err, message) => {
            //                     io.sockets.emit('messages', message);
            //                     });
            //                 });
            // })
        });
        // отладка

                

        // server.listen(8000, () => console.log('Заходи на localhost:8000'));

        server.listen(8000);
        console.log('ready on localhost:8000');
        
        // use socket.io
        // var io = require('socket.io').listen(server);
        // console.log('socket on localhost:8000');

        io.on('connection', function (socket) {
            var now = new Date()
            // var d = new Date(year, month, day);
            console.log('A client is connected!');   
        });

    })