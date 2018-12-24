import java.util.*;
import java.io.*;
import java.math.*;



public class fact{
    // funcion que comprueba que el numero es primo.
    public static boolean prime(BigInteger n)
    {
        if(n.compareTo(BigInteger.ONE)==0 || n.compareTo(new BigInteger("2"))==0)
        {
            return true;
        }
        BigInteger mitad=n.divide(new BigInteger("2"));

        for(BigInteger i=new BigInteger("3"); i.compareTo(mitad)<=0;i=i.add(new BigInteger("2")))
        {// si no se puede dividir entre ningun numero es primo.

            if(n.mod(i).equals(BigInteger.ZERO))
            {
                return false; 
            }

        }
            return true;

    }
    public static List<BigInteger> primeFactorBig(BigInteger a){
        List<BigInteger> factores = new LinkedList<BigInteger>();
       
        //Desde i=2 mientras i sea menor que el numero y a no sea 1, i++
        for (BigInteger i = BigInteger.valueOf(2); i.compareTo(a) <= 0 && !a.equals(BigInteger.ONE); i = i.add(BigInteger.ONE)){
            while (a.remainder(i).equals(BigInteger.ZERO) && prime(i)) { //si el numero es dibisible y es primo entonces es factor
                factores.add(i); //lo ponemos en la lista
                a = a.divide(i); //y lo dividimos entres su factor
            }
        }
        return factores;
    }
    public static void main(String[] args){


        
        List<BigInteger> numeros=new LinkedList<BigInteger>();
        numeros.add(new BigInteger("127"));
	numeros.add(new BigInteger("8191"));
        numeros.add(new BigInteger("131071"));
        numeros.add(new BigInteger("524287"));
       
        List<BigInteger> factores=new LinkedList<BigInteger>();
        ArrayList<Double> media=new ArrayList<Double>();
	for(int j=0;j<100;j++){
		double puntuacion=0;
		ArrayList<Long> tiempos =new ArrayList<Long>();
		for(int i=0;i<numeros.size();i++){
		    long time_start, time_end;
		    time_start = System.currentTimeMillis();
		    factores=primeFactorBig(numeros.get(i));
		    time_end = System.currentTimeMillis();
		    tiempos.add(time_end-time_start);
		}
		for(int k=0;k<tiempos.size();k++){
			puntuacion+=tiempos.get(k);   
		}
		media.add(puntuacion);
	}
	double total=0;
	for(int i=1;i<media.size();i++){
		total+=media.get(i);
	}
	total/=(media.size()-1);
	
        double varianza=0;
	for(int i=1;i<media.size();i++){
		varianza+=(media.get(i)-total)*(media.get(i)-total);
	}	
	varianza=varianza/(media.size()-1);
        
        System.out.println("TIEMPO MEDIO SISTEMA: "+total);
	System.out.println("VARIANZA "+varianza);
    }   
}
