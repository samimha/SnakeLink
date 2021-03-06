
package org.example.websocket;



import java.io.IOException;

import java.util.logging.Level;
import java.util.logging.Logger;
import javax.enterprise.context.ApplicationScoped;
import javax.websocket.server.ServerEndpoint;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;

@ApplicationScoped
@ServerEndpoint("/actions")
public class WebSocketServer {
    static int pelaaja=0;
    private int myController;
    private SessionHandler sessionHandler = new SessionHandler();
    private Session myhost;
    
    
     @OnOpen
        public void open(Session session) {
            System.out.println("---------------------------------------Opening Session: " + session.getId());
            
//            try{
//            session.getBasicRemote().sendText(""+pelaaja);
//                System.out.println("---------------------------------Connected as player "+pelaaja);
//            pelaaja++;
//            }catch (IOException ex) {
//            
//            Logger.getLogger(SessionHandler.class.getName()).log(Level.SEVERE, null, ex);
//        }
    }

    @OnClose
        public void close(Session session) throws IOException {
            sessionHandler.removeSession(session);
            System.out.println("---------------------------------------Closing Session: "+ session.getId());
            myhost.getBasicRemote().sendText("delete "+myController);
    }

    @OnError
        public void onError(Throwable error) {
            Logger.getLogger(WebSocketServer.class.getName()).log(Level.SEVERE, null, error);
    }

    @OnMessage
        public void handleMessage(String message, Session session) throws IOException {
            String[] parsed = message.split(" ");
            System.out.println("--------------------------------------Message from: "+session.getId());
            if(parsed[0].equals("host")){
                pelaaja=1;
                sessionHandler.connectHost(parsed[1],session);
                System.out.println("--------------------------------Host request send from "+ session.getId());
                
            }else if(parsed[0].equals("connect")){
                myhost=sessionHandler.getHost(parsed[1]);
                myhost.getBasicRemote().sendText(parsed[2]+" "+parsed[3]);
                myController=pelaaja;
                pelaaja++;
            }else{
                System.out.println("-------------------------------------Message to host from: "+session.getId());
                myhost.getBasicRemote().sendText(myController+message);
//                sessionHandler.sendControllerCommand(parsed[0],parsed[1]);
            }
//            session.getBasicRemote().sendText(message);
            System.out.println("moro");
    }
}
