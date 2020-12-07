package sha256;

import java.util.Scanner;

public class main{	
	public static void main(String[] args)
	{
		while(true)
		{
			System.out.println("input the text:");
			Scanner in = new Scanner(System.in);
			String input = in.nextLine();
			sha256 sha = new sha256(input);
			System.out.println("the sha256 result is:");
			System.out.println(sha.getSHA());
		}
	}
}