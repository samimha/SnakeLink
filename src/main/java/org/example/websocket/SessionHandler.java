
package org.example.websocket;

import java.io.IOException;
import javax.enterprise.context.ApplicationScoped;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.websocket.Session;

//import org.example.model.Device;

@ApplicationScoped
public class SessionHandler {
//    private static final Set<Session> sessions = new HashSet<>();
//    private static final Set<Session> devices = new HashSet<>();
//    private static Session host;
    private static final Hashtable<String,Session> hosts = new Hashtable<String,Session>();
    //private static final Hashtable<String,Session> controllers = new Hashtable<String,Session>();
   
    public SessionHandler(){
        
    }
    public Session getHost(String id){
        return hosts.get(id);
    }

    public void removeSession(Session session) {
        System.out.println("----------------------Session removed: "+ session.getId());
        hosts.values().remove(session);
        //controllers.values().remove(session);
    }
    public void connectHost(String id,Session session){
        hosts.put(id,session);
        System.out.println("------------------------host added: "+hosts.get(id).getId());
        
    }
    
    public void sendControllerCommand(String host,String command){
        try{
            System.out.println("---------Trying to send message to host");
            //for (Session session : sessions) {
            hosts.get(host).getBasicRemote().sendText(command);
        //}
            System.out.println("---------------------Message send to host: "+host);
        }catch(IOException ex) {
            
            Logger.getLogger(SessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public void addController(String id,Session session) {
        //controllers.put(id,session);
        System.out.println("-----------------------Session added: "+ session.getId());
    }
    
    private void sendToSession(Session session, String message) {
        try {
            session.getBasicRemote().sendText(message);
        } catch (IOException ex) {
            //sessions.remove(session);
            Logger.getLogger(SessionHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    private void sendToAllConnectedSessions(String message) {
    }
}
