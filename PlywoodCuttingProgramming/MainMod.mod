MODULE MainMod
    PERS tooldata tCompress025:=[TRUE,[[-244.295,-0.232878,212.8031],[0.7071068,0,-0.707168,0]],[40,[50,0,120],[1,0,0,0],0,0,0]];
    PERS wobjdata wPlywood2by2:=[FALSE,TRUE,"",[[1913.74,1550.62,647.982],[0.0032222,-0.0003864,-0.0020345,0.9999927]],[[0,0,0],[1,0,0,0]]];

    PERS speeddata v17:=[17,500,5000,1000];
    PERS speeddata v300:=[300,500,5000,1000];
    PERS speeddata v59:=[59,500,5000,1000];
    PERS speeddata v37:=[37,500,5000,1000];
    PERS speeddata v47:=[47,500,5000,1000];
    PERS speeddata v16:=[16,500,5000,1000];
    PERS speeddata v14:=[14,500,5000,1000];
    PERS speeddata v42:=[42,500,5000,1000];
    PERS speeddata v75:=[75,500,5000,1000];
    PERS speeddata v25:=[25,500,5000,1000]; 




    PROC Main()

        VAR num fk;  
        
        ConfJ\On;
        ConfL\Off; 
        
        
        
        TPErase; 

        !Set dial on VFD to configured speed
        TPReadFK fk,"Please set dial to required speed on VFD","Complete","","","","Stop";
        
        IF fk <> 1 THEN
            Stop;
        ENDIF

        setdo Local_IO_0_DO11, 1;
        waittime 1; 

        TPWrite "Cutting Window";
        cutWindow; 
        
        TPWrite "Cutting Panels";
        cutPanel; 
        
        setdo Local_IO_0_DO11, 0; 
    ENDPROC
ENDMODULE