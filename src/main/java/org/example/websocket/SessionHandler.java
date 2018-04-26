
package org.example.websocket;

import java.io.IOException;
import javax.enterprise.context.ApplicationScoped;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.websocket.Session;

//import org.example.model.Device;

@ApplicationScoped
public class SessionHandler {
    private static final Set<Session> sessions = new HashSet<>();
    //private final Set<Device> devices = new HashSet<>();
    private static Session host;
    
    public SessionHandler(){
        
    }
    
    public void addSession(Session session) {
        sessions.add(session);
        System.out.println("-----------------------Session added: "+ session.getId());
    }

    public void removeSession(Session session) {
        System.out.println("----------------------Session removed: "+ session.getId());
        sessions.remove(session);
    }
    public void connectHost(Session session){
        host=session;
        System.out.println("------------------------host added: "+host.getId());
        
    }
    
    public void sendControllerCommand(String command){
        try{
            System.out.println("---------Trying to send message to host");
            //for (Session session : sessions) {
            host.getBasicRemote().sendText(command);
        //}
            System.out.println("---------------------Message send to host: "+command);
        }catch(IOException ex) {
            
            Logger.getLogger(SessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    private void sendToSession(Session session, String message) {
        try {
            session.getBasicRemote().sendText(message);
        } catch (IOException ex) {
            sessions.remove(session);
            Logger.getLogger(SessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    private void sendToAllConnectedSessions(String message) {
    }
}
