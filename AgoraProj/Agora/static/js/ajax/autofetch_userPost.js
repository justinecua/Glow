
export function count_new_posts(userId){
    
    const ablyScript = document.createElement('script');
    ablyScript.src = 'https://cdn.ably.io/lib/ably.min-1.js';
    ablyScript.onload = () => {
  
    const ably = new Ably.Realtime('ru_QJA.LX6KeA:6pykpDiiF8i68udlvvVQ6_xn6zlL7CLBUfdFZCSbm4k');
    const channel = ably.channels.get('posts');

    channel.subscribe(message => {
        console.log('New post received:', message.data);
        
    });

    channel.on('attached', () => {
        console.log('Connected to posts channel');
    });
    
  };
  document.body.appendChild(ablyScript);
};


