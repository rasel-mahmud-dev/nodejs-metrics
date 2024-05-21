
my string = `


router.get('/user', (req: Request, res: Response) => {
// Dummy data
const users: UserResponse = [
{ id: 1, name: 'John Doe' },
{ id: 2, name: 'Jane Doe' }
];

    res.json(users);
});


router.post('/user/:id', (req: Request, res: Response) => {
const users: UserResponse = [
{ id: 1, name: 'John Doe' },
{ id: 2, name: 'Jane Doe' }
];
res.json(users);
});


`


now i want to gen like this

{
"paths": {
"/user": {
"get": {
"description": "",
"responses": {
"200": {
"description": "OK"
}
}
}
},
"/user/{id}": {
"post": {
"description": "",
"parameters": [
{
"name": "id",
"in": "path",
"required": true,
"schema": {
"type": "string"
}
}
],
"responses": {
"200": {
"description": "OK"
}
}
}
}
}}