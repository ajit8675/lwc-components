public with sharing class UserAccessController {
    
    @AuraEnabled
    public static AccessWrapperClass getRelatedAccess(String s){
        User u = new User();

        if(s.contains('@')){
            u = [select id, name, profileid from user where email = :s];
        }else{
            u = [select id, name, profileid from user where id = :s];
        }

        List<User> relatedUsers = [select id from User where profileid = :u.ProfileId];

        List<Id> permIdInclueded = new List<Id>();
        for(PermissionSetAssignment pm : [select permissionSetid from permissionsetassignment where AssigneeId in : relatedUsers]){
            permIdInclueded.add(pm.permissionSetid);
        }
        List<Id> permIdExcluded = new List<Id>();
        for(PermissionSetAssignment pm : [select permissionSetid from permissionsetassignment where AssigneeId = : u.id]){
            permIdExcluded.add(pm.permissionSetid);
        }

        List<PermissionSet> permissionSetList = [select id, name from permissionset where id in : permIdInclueded and id not in  :permIdExcluded];
        
        List<Id> pgIdIncluded = new List<Id>();
        for(GroupMember gm : [select groupid from groupmember where UserOrGroupId in : relatedUsers]){
            pgIdIncluded.add(gm.groupid);
        }

        List<Id> pgIdExcluded = new List<Id>();
        for(GroupMember gm : [select groupid from groupmember where UserOrGroupId =: u.id]){
            pgIdExcluded.add(gm.groupid);
        }

        List<Group> pgList = [select name from Group where id in : pgIdIncluded and id not in : pgIdExcluded ];
        List<String> permStringList = new List<String>();
        for(PermissionSet pm : permissionSetList){
            permStringList.add(pm.name);
        }
        List<String> pgStringList = new List<String>();
        for(Group gm : pgList){
            pgStringList.add(gm.name);
        }
        AccessWrapperClass accessResult = new AccessWrapperClass();
        accessResult.permissionSets = permStringList;
        accessResult.publicGroups = pgStringList;
        return accessResult;
    }

    public class AccessWrapperClass{
        @AuraEnabled public List<String> permissionSets;
        @AuraEnabled public List<String> publicGroups;
    }
}